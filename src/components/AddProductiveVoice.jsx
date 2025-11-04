import React, { use } from 'react'
import { useEffect } from 'react'

export default function AddProductiveVoice({ onClose, onResult }) {

    useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          "Your browser does not support voice recognition. Please use Chrome."
        );
        onClose();
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-GH";
      recognition.continuous = false;
      recognition.interimResults = false;

      //its tells the speech recognition service to be ready to  listen for incoming audio
      recognition.onstart = () => {
        console.log("Listening...");
      };


      //speech recognition returns result here
      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;

        //events.results returns technically the Speech Recognition Result List of all recognized phrases.
        // .transcript extracts just the recognized text as a plain string.
        //so its Take the first recognition result, get its most confident alternative, and extract the text that was heard.

        console.log("Heard:", spokenText);
        onResult(spokenText);
        onClose(); // close only after getting a result
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      // keep modal open while listening
      recognition.onend = () => {
        console.log("Stopped listening");
      };

      recognition.start();

      // stop listening only when modal is unmounted
      return () => recognition.stop();
    }, [onClose, onResult]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 md:w-[50%]">
        {/* Google-style voice wave animation */}
        <div className="flex items-end justify-center gap-1 h-10">
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.45s", height: "1rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.3s", height: "1.5rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.15s", height: "0.75rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ height: "1.75rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.15s", height: "1.25rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.3s", height: "1rem" }}
          ></span>
          <span
            className="w-1 bg-green-500 rounded-full animate-wave"
            style={{ animationDelay: "-0.45s", height: "1.5rem" }}
          ></span>
        </div>  

        <p className="text-gray-700 font-semibold">Listening...</p>
        <p className="text-sm text-gray-500 italic">
          Please speak your details clearly
        </p>
        <button
          onClick={onClose}
          className="mt-3 bg-gray-200 px-3 py-1 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
