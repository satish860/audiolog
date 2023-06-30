"use client";
import { Mic } from "lucide-react"
import React, { useState } from 'react';

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

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
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