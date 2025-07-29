import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Moon,
    Phone,
    PhoneCall,
    ArrowLeft,
    Settings,
    CreditCard,
    Edit3,
    Check,
    X,
    Waves
} from 'lucide-react';
import { useMicVAD } from "@ricky0123/vad-react"
import { initializeSocket } from '../../socket/socket';
import { utils } from "@ricky0123/vad-react"
import { UserButton, useAuth } from '@clerk/clerk-react';

const VoiceCallPage = ({ user }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newBuddyName, setNewBuddyName] = useState('Buddy');
    const [buddyName, setBuddyName] = useState('Buddy');
    const [callsRemaining, setCallsRemaining] = useState(2);
    const [isCalling, setIsCalling] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [isCallConnected, setIsCallConnected] = useState(false);
    const socketRef = useRef();
    const audioContextRef = useRef(null);
    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRinging, setIsRinging] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const ringtoneRef = useRef(null);
    const callTimerRef = useRef(null);
    const { getToken } = useAuth();
    const [conversationId, setConversationId] = useState(null);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);

    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);
    const audioElementRef = useRef(null);
    const audioChunkQueue = useRef([]);
    const isAppending = useRef(false);

    const processAudioQueue = () => {
        if (
            !sourceBufferRef.current ||
            !mediaSourceRef.current ||
            mediaSourceRef.current.readyState !== "open" ||
            sourceBufferRef.current.updating ||
            isAppending.current ||
            audioChunkQueue.current.length === 0
        ) {
            return;
        }

        isAppending.current = true;
        const chunk = audioChunkQueue.current.shift();

        try {
            sourceBufferRef.current.appendBuffer(new Uint8Array(chunk));
        } catch (err) {
            console.error("AppendBuffer error", err);
            isAppending.current = false;
            return;
        }
    };

    // --- Add resetAudioStream helper ---
    const resetAudioStream = () => {
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current.src = '';
        }
        audioChunkQueue.current = [];
        sourceBufferRef.current = null;
        mediaSourceRef.current = null;
        isAppending.current = false;
    };


    const navigate = useNavigate();

    useEffect(() => {
        console.log("Conversation Id: " + conversationId);
    }, [conversationId])

    const vad = useMicVAD({
        onSpeechStart: (audio) => {
            console.log("User started talking")
        },
        onSpeechEnd: (audio) => {
            if (isCallConnected && socketRef.current && conversationId) {
                // --- Reset audio stream for new AI reply ---
                resetAudioStream();
                const wavBuffer = utils.encodeWAV(audio);
                socketRef.current.emit("audio", { wavBuffer, conversationId });
            }
            console.log("User stopped talking")
        },
        startOnLoad: false
    })

    useEffect(() => {
        if (!audioElementRef.current) return;

        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;

        const audioEl = audioElementRef.current;
        audioEl.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener("sourceopen", () => {
            const mime = 'audio/mpeg';
            const sourceBuffer = mediaSource.addSourceBuffer(mime);
            sourceBufferRef.current = sourceBuffer;

            sourceBuffer.addEventListener("updateend", () => {
                isAppending.current = false;
                processAudioQueue();
            });

            audioEl.play().catch((e) => {
                console.warn("Autoplay failed", e);
            });
        });
    }, [isCalling]);

    const playAudioResponse = async (audio) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const audioData = await audioContextRef.current.decodeAudioData(audio);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioData;
            source.connect(audioContextRef.current.destination);
            source.start();
            source.onended = () => {
                setIsPlaying(false);
                setAudioQueue((prev) => prev.slice(1));
            };
            setIsPlaying(true);
            console.log('Playing AI response');
        } catch (error) {
            console.error('Error playing audio response:', error);
            setIsPlaying(false);
            setAudioQueue((prev) => prev.slice(1));
        }
    };

    useEffect(() => {
        if (!isPlaying && audioQueue.length > 0) {
            playAudioResponse(audioQueue[0]);
        }
    }, [audioQueue, isPlaying]);

    useEffect(() => {
        const onConnect = () => {
            console.log("connected to server")
        }

        const onMessage = (message) => {
            console.log("message from server", message)
        }

        const onAudioResponseReceived = (audioResponse) => {
            console.log("audio response received")
            setAudioQueue((prev) => [...prev, audioResponse]);
        }

        const onAudioChunkReceived = (chunk) => {
            audioChunkQueue.current.push(chunk);
            processAudioQueue();
        };

        const onDisconnect = () => {
            console.log("Disconnected");
        }

        const connectSocket = async () => {
            if (isCalling || isRinging) {
                const token = await getToken();
                socketRef.current = await initializeSocket(token);
                socketRef.current.on("connect", onConnect)
                socketRef.current.on("message", onMessage)
                socketRef.current.on("disconnect", onDisconnect)
                socketRef.current.on("audio-response", onAudioResponseReceived)
                socketRef.current.on("audio-chunk", onAudioChunkReceived)
            }
        };
        connectSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.off("connect", onConnect);
                socketRef.current.off("message", onMessage);
                socketRef.current.off("disconnect", onDisconnect);
                socketRef.current.off("audio-response", onAudioResponseReceived);
                socketRef.current.off("audio-chunk", onAudioChunkReceived);
            }
        }
    }, [isCalling, isRinging])

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSaveBuddyName = () => {
        setBuddyName(newBuddyName);
        setIsEditingName(false);
    };

    const handleStartCall = async () => {
        if (callsRemaining <= 0) {
            setShowToast({
                type: 'error',
                message: "You've run out of free calls. Please top up to continue."
            });
            return;
        }
        setIsLoadingConversation(true);
        setIsRinging(true);
        setIsCalling(false);
        setIsCallConnected(false);
        setCallDuration(0);
        if (ringtoneRef.current) {
            ringtoneRef.current.currentTime = 0;
            ringtoneRef.current.play();
        }
        const token = await getToken();
        if (!socketRef.current) {
            socketRef.current = await initializeSocket(token);
        }

        socketRef.current.once("call-started", (data) => {
            setConversationId(data.conversationId);
            setIsRinging(false);
            setIsCalling(true);
            setIsCallConnected(true);
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            setIsLoadingConversation(false);
            vad.start();
        });

        socketRef.current.emit("start-call", { uuid: user.id });

        setTimeout(() => {
            if (isRinging) {
                setIsRinging(false);
                setIsLoadingConversation(false);
                setShowToast({
                    type: 'error',
                    message: 'Failed to start call. Please try again.'
                });
                if (ringtoneRef.current) {
                    ringtoneRef.current.pause();
                    ringtoneRef.current.currentTime = 0;
                }
            }
        }, 10000);
    };

    const handleEndCall = async () => {
        setIsCalling(false);
        setIsCallConnected(false);
        setIsRinging(false);

        if (socketRef.current && conversationId) {
            socketRef.current.emit('end-call', { conversationId });
        }

        setConversationId(null);
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
        setCallDuration(0);
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setAudioQueue([]);
        setIsPlaying(false);
        setShowToast({
            type: 'success',
            message: `Call ended with ${buddyName}.`
        });
    };

    useEffect(() => {
        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-900 to-night-800">
            {/* Header */}
            <audio ref={audioElementRef} hidden />

            <header className="bg-night-900/95 backdrop-blur-md border-b border-primary-800/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Left Side */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/features')}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>

                            <div className="flex items-center space-x-2">
                                <Moon className="w-8 h-8 text-primary-400" />
                                <span className="text-2xl font-bold text-white font-display">3 am Buddy</span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Centered Call Box */}
                <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
                    <div className="bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20 w-full max-w-lg">
                        {/* Buddy Name Section */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-white">Voice Call with</h2>
                                {isEditingName ? (
                                    <div className="mt-2 space-y-2">
                                        <input
                                            type="text"
                                            value={newBuddyName}
                                            onChange={(e) => setNewBuddyName(e.target.value)}
                                            className="w-full px-3 py-2 bg-night-700 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200 text-sm sm:text-base"
                                            placeholder="Enter buddy name"
                                        />
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSaveBuddyName}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditingName(false);
                                                    setNewBuddyName(buddyName);
                                                }}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-primary-300 text-base sm:text-lg font-semibold truncate">{buddyName}</span>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="text-primary-400 hover:text-primary-300 transition-colors duration-200 p-2 ml-2"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            {/* Call Animation */}
                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                                    <PhoneCall className="w-16 h-16 text-white" />
                                    {isRinging && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-primary-200 text-lg animate-pulse">Ringing...</span>
                                        </div>
                                    )}
                                    {isCalling && (
                                        <>
                                            <div className="absolute inset-0 bg-primary-400/30 rounded-full animate-ping"></div>
                                            <div className="absolute inset-2 bg-primary-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                        </>
                                    )}
                                </div>

                                {/* Sound Waves Animation */}
                                {isCalling && (
                                    <div className="flex justify-center space-x-1">
                                        <Waves className="w-6 h-6 text-primary-400 animate-pulse" />
                                        <Waves className="w-6 h-6 text-primary-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                        <Waves className="w-6 h-6 text-primary-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                )}
                            </div>

                            {/* Call Timer */}
                            {isCalling && (
                                <div className="mb-4">
                                    <span className="inline-block bg-night-700 text-primary-200 px-4 py-2 rounded-full font-mono text-lg">
                                        {String(Math.floor(callDuration / 60)).padStart(2, '0')}:{String(callDuration % 60).padStart(2, '0')}
                                    </span>
                                </div>
                            )}

                            {/* Call Counter */}
                            <div className="mb-6">
                                <p className="text-gray-300 text-sm mb-2">Free Voice Calls</p>
                                <div className="inline-flex items-center bg-primary-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-500/30">
                                    <Phone className="w-5 h-5 text-primary-400 mr-2" />
                                    <span className="text-primary-200">
                                        You have <span className="text-white font-bold">{callsRemaining}</span> free voice calls remaining
                                    </span>
                                </div>
                            </div>

                            {/* Call Button */}
                            <button
                                onClick={isCalling || isRinging ? handleEndCall : handleStartCall}
                                disabled={isRinging || isLoadingConversation}
                                className={`w-full ${isCalling ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700' : isRinging ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg flex items-center justify-center`}
                            >
                                {isLoadingConversation ? (
                                    <>Starting...</>
                                ) : isRinging ? (
                                    <>
                                        <PhoneCall className="w-6 h-6 mr-3 animate-pulse" />
                                        Ringing...
                                    </>
                                ) : isCalling ? (
                                    <>
                                        <X className="w-6 h-6 mr-3" />
                                        End Call
                                    </>
                                ) : (
                                    <>
                                        <PhoneCall className="w-6 h-6 mr-3" />
                                        Call {buddyName}
                                    </>
                                )}
                            </button>

                            {callsRemaining <= 1 && (
                                <p className="text-orange-400 text-sm mt-4">
                                    ⚠️ You're running low on free calls. Consider topping up!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-12 bg-night-800/50 backdrop-blur-sm rounded-3xl p-8 border border-primary-500/20">
                    <h3 className="text-2xl font-bold text-white text-center mb-8">How Voice Calls Work</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary-400 font-bold">1</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Click Call</h4>
                            <p className="text-gray-400 text-sm">Press the call button to connect with your AI buddy</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary-400 font-bold">2</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Start Talking</h4>
                            <p className="text-gray-400 text-sm">Have a natural conversation in your preferred language</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary-400 font-bold">3</span>
                            </div>
                            <h4 className="text-white font-semibold mb-2">Feel Better</h4>
                            <p className="text-gray-400 text-sm">Get the support and comfort you need, anytime</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-night-800 border rounded-2xl p-4 shadow-xl transform transition-all duration-300 ${showToast.type === 'success'
                    ? 'border-green-500/50 bg-gradient-to-r from-green-900/20 to-emerald-900/20'
                    : 'border-red-500/50 bg-gradient-to-r from-red-900/20 to-orange-900/20'
                    }`}>
                    <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${showToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                            {showToast.type === 'success' ? '✅' : '❌'}
                        </div>
                        <div className="flex-1">
                            <p className="text-white text-sm font-medium">{showToast.message}</p>
                        </div>
                        <button
                            onClick={() => setShowToast(null)}
                            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <audio ref={ringtoneRef} src="/ringtone.mp3" preload="auto" />
        </div>
    );
};

export default VoiceCallPage;