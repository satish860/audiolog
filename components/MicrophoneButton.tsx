"use client";
import { Mic } from "lucide-react"
import React, { useState } from 'react';
import { Uploader } from "uploader";
import axios from "axios";

export const MicrophoneButton: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);


    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const recorder = new MediaRecorder(stream);
                recorder.addEventListener('dataavailable', handleDataAvailable);
                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };

    const stopRecording = async () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleDataAvailable = async (event: BlobEvent) => {
        var chunks = [];
        if (event.data.size > 0) {
            chunks.push(event.data);
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
            const blob = new Blob(chunks, { type: 'audio/webm' });
            console.log("blob data Size:",blob.size);
            const arrayBuffer = await blob.arrayBuffer();
            const apiUrl = 'https://jetdriveapi.satish860.workers.dev/api/upload/file3';
            const apiKey = process.env.NEXT_PUBLIC_JETDRIVE_API_KEY ;
        
            const headers = {
              'Content-Type': 'audio/webm',
              'x-api-key': apiKey
            };
        
            const response = await axios.put(apiUrl, arrayBuffer, { headers });
        
            console.log('File uploaded successfully');

            // Use the converted ArrayBuffer here
            console.log('Converted ArrayBuffer:', arrayBuffer);
            
        }
    };



    const handleDownload = () => {
        if (audioChunks.length > 0) {
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            a.click();
            setAudioChunks([]);
        }
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording} className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
                <Mic></Mic>
            </button>
            {audioChunks.length > 0 && (
                <button className="mt-4" onClick={handleDownload}>Download Recording</button>
            )}
        </div>
    )
}