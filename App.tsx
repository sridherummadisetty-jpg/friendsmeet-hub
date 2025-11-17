import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityType, Message, User } from './types';
import { generateIcebreaker } from './services/geminiService';
import { FilmIcon, MusicIcon, UsersIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon, XIcon, PlusIcon, Share2Icon, ImageIcon, YoutubeIcon, PrimeVideoIcon, UserIcon, LockIcon, SyncIcon, CheckCircleIcon, UploadCloudIcon, LogOutIcon, LinkIcon, AlertTriangleIcon, MaximizeIcon, MinimizeIcon } from './components/icons';

// --- Helper Components ---

const SplashScreen: React.FC<{ isFadingOut: boolean }> = ({ isFadingOut }) => (
  <div className={`h-screen w-screen bg-gradient-to-br from-brand-primary to-brand-secondary flex flex-col items-center justify-center p-4 text-center ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
    <div className="animate-pulse-glow mb-6">
      <UsersIcon className="w-24 h-24 text-brand-accent" />
    </div>
    <h1 className="text-4xl font-bold text-white">FriendsMeet Hub</h1>
    <p className="text-lg text-brand-text-secondary mt-2 animate-pulse">Getting things ready...</p>
  </div>
);

const AuthView: React.FC<{
  onLogin: (userId: string, pass: string) => boolean;
  onRegister: (name: string, userId: string, pass: string) => boolean;
  onGuestLogin: (name: string) => boolean;
}> = ({ onLogin, onRegister, onGuestLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    try {
      if (isLoginView) {
        if (!userId || !password) { setError('Please fill in all fields.'); return; }
        success = onLogin(userId, password);
        if (!success) setError('Invalid credentials. Please try again.');
      } else {
        if (!username || !userId || !password) { setError('Please fill in all fields.'); return; }
        success = onRegister(username, userId, password);
        if (!success) setError('User ID already exists. Please try logging in.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };
  
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!guestName.trim()) {
        setError('Please enter a name to join.');
        return;
    }
    const success = onGuestLogin(guestName.trim());
    if (!success) {
        setError('This name is already in use for this session.');
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-brand-primary to-brand-secondary flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="w-full max-w-md bg-brand-surface bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
        <h1 className="text-4xl font-bold mb-2">FriendsMeet Hub</h1>
        <p className="text-lg text-brand-text-secondary mb-6">Your virtual hangout awaits.</p>
        
        <div className="bg-yellow-900/30 border border-yellow-500 text-yellow-300 px-4 py-3 rounded-lg relative mb-6 text-sm text-left flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="font-bold">Security Notice:</strong>
            <span className="block sm:inline"> This is a demo application. Please do not use real passwords. All user data is stored temporarily in your browser.</span>
          </div>
        </div>
        
        <div className="flex justify-center border-b border-brand-primary/50 mb-6">
          <button onClick={() => { setIsLoginView(true); setError(''); }} className={`px-6 py-2 text-lg font-semibold transition-colors ${isLoginView ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}>Login</button>
          <button onClick={() => { setIsLoginView(false); setError(''); }} className={`px-6 py-2 text-lg font-semibold transition-colors ${!isLoginView ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" /><input type="text" value={username} onChange={handleInputChange(setUsername)} placeholder="Username" className="w-full bg-brand-bg/70 border border-brand-primary/50 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" /></div>
          )}
          <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" /><input type="text" value={userId} onChange={handleInputChange(setUserId)} placeholder="User ID (e.g., email)" className="w-full bg-brand-bg/70 border border-brand-primary/50 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" /></div>
          <div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" /><input type="password" value={password} onChange={handleInputChange(setPassword)} placeholder="Password" className="w-full bg-brand-bg/70 border border-brand-primary/50 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" /></div>
          <button type="submit" className="w-full px-8 py-3 bg-brand-accent text-brand-bg font-bold rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg">{isLoginView ? 'Login' : 'Create Account'}</button>
        </form>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <form onSubmit={handleGuestSubmit}>
            <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                <input type="text" value={guestName} onChange={handleInputChange(setGuestName)} placeholder="Enter your name" className="w-full bg-brand-bg/70 border border-brand-primary/50 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
            </div>
            <button type="submit" className="w-full mt-4 px-8 py-3 bg-brand-secondary text-white font-bold rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg">Join as Guest</button>
        </form>
        
        {error && <p className="text-red-400 text-sm mt-4 h-5">{error}</p>}
        {!error && <div className="h-5 mt-4"></div>} {/* Keep layout consistent */}
      </div>
    </div>
  );
};

const MediaViewer: React.FC<{ activity: ActivityType; syncStatus: 'idle' | 'syncing' | 'synced'; selectedLocalFile: File | null; webVideoUrl: string; onToggleFullscreen: () => void; isFullscreen: boolean; }> = ({ activity, syncStatus, selectedLocalFile, webVideoUrl, onToggleFullscreen, isFullscreen }) => {
  
    const isVideoActive = (activity === ActivityType.LocalVideo && selectedLocalFile) || (activity === ActivityType.WebVideo && webVideoUrl);

    // Helper component to manage Object URL lifecycle for local file previews
    const LocalMediaDisplay: React.FC<{ file: File }> = ({ file }) => {
        const [url, setUrl] = useState('');

        useEffect(() => {
            if (!file) return;
            const objectUrl = URL.createObjectURL(file);
            setUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }, [file]);
        
        if (!url) return null;

        if (file.type.startsWith('video/')) {
            return <video src={url} controls autoPlay className="w-full h-full object-contain" />;
        }
        if (file.type.startsWith('image/')) {
            return <img src={url} alt={file.name} className="w-full h-full object-contain" />;
        }
        if (file.type.startsWith('audio/')) {
            return (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center p-8 animate-fade-in">
                    <MusicIcon className="w-24 h-24 mb-6" />
                    <h2 className="text-2xl font-bold text-center break-all">{file.name}</h2>
                    <audio src={url} controls autoPlay className="mt-8" />
                </div>
            );
        }
        return <div className="p-4">Unsupported file type.</div>;
    };

    const renderContent = () => {
        switch (activity) {
            case ActivityType.Movies:
                return <div className="w-full h-full bg-black flex items-center justify-center text-center p-4"><div className="animate-fade-in"><FilmIcon className="w-16 h-16 mx-auto mb-4" /><h2 className="text-3xl font-bold">Movie Title Placeholder</h2><p>Playback is synchronized for all friends.</p></div></div>;
            case ActivityType.Music:
                return <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex flex-col items-center justify-center p-8 animate-fade-in"><MusicIcon className="w-24 h-24 mb-6" /><h2 className="text-4xl font-bold">Album Name</h2><p className="text-xl text-brand-text-secondary">Artist Name</p></div>;
            case ActivityType.Social:
                return <div className="w-full h-full bg-brand-surface p-4 overflow-y-auto animate-fade-in"><div className="max-w-xl mx-auto space-y-4"><h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2"><UsersIcon /> Social Feed</h2>{[1, 2, 3].map(i => <div key={i} className="bg-gray-800 rounded-lg p-4"><p>Placeholder for social media post {i}.</p></div>)}</div></div>;
            case ActivityType.YouTube:
                return <div className="w-full h-full bg-black flex items-center justify-center text-center p-4"><div className="animate-fade-in"><YoutubeIcon className="w-24 h-24 text-red-600 mx-auto mb-4" /><h2 className="text-3xl font-bold">YouTube is now playing</h2><p>Playback is synchronized for all friends.</p></div></div>;
            case ActivityType.PrimeVideo:
                return <div className="w-full h-full bg-black flex items-center justify-center text-center p-4"><div className="animate-fade-in"><PrimeVideoIcon className="w-24 h-24 text-blue-400 mx-auto mb-4" /><h2 className="text-3xl font-bold">Prime Video is now playing</h2><p>Playback is synchronized for all friends.</p></div></div>;
            case ActivityType.WebVideo:
                if (webVideoUrl) {
                    return <iframe src={webVideoUrl} title="Shared Video" className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;
                }
                return <div className="w-full h-full bg-black flex items-center justify-center text-center p-4"><div className="animate-fade-in"><LinkIcon className="w-16 h-16" /><h2 className="text-3xl font-bold mt-4">Play Video from the Web</h2><p>Use the Host Panel to paste a video URL.</p></div></div>;
            case ActivityType.LocalVideo:
            case ActivityType.LocalImage:
            case ActivityType.LocalMusic:
                 if (selectedLocalFile) {
                    return <LocalMediaDisplay file={selectedLocalFile} />;
                }
                const placeholderIcon = activity === ActivityType.LocalVideo ? <FilmIcon className="w-16 h-16" /> : activity === ActivityType.LocalImage ? <ImageIcon className="w-16 h-16" /> : <MusicIcon className="w-16 h-16" />;
                return <div className="w-full h-full bg-black flex items-center justify-center text-center p-4"><div className="animate-fade-in">{placeholderIcon}<h2 className="text-3xl font-bold mt-4">Select a local file to share</h2><p>Use the Host Panel to upload and choose a file.</p></div></div>;
            default: return null;
        }
    };

  const SyncIndicator = () => {
    if (syncStatus === 'idle') return null;
    const isSyncing = syncStatus === 'syncing';
    const text = isSyncing ? 'Syncing...' : 'Synchronized';
    const icon = isSyncing ? <SyncIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5 text-brand-accent" />;
    return (
        <div className="absolute top-2 left-2 z-20 bg-brand-surface/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 animate-fade-in shadow-lg">
            {icon}
            <span>{text}</span>
        </div>
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg shadow-2xl group/viewer bg-black">
        <SyncIndicator />
        {renderContent()}
        {isVideoActive && (
            <button
                onClick={onToggleFullscreen}
                className="absolute bottom-4 right-4 z-20 bg-brand-surface/60 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover/viewer:opacity-100 transition-opacity"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
                {isFullscreen ? <MinimizeIcon className="w-5 h-5" /> : <MaximizeIcon className="w-5 h-5" />}
            </button>
        )}
    </div>
  );
};

const VideoGrid: React.FC<{ stream: MediaStream | null; participants: User[]; onRemoveParticipant: (name: string) => void; isHost: boolean; isFullscreen: boolean; }> = ({ stream, participants, onRemoveParticipant, isHost, isFullscreen }) => (
    <div className={
        isFullscreen
            ? "absolute top-4 right-4 z-30 w-48 max-h-[calc(100%-2rem)] overflow-y-auto grid grid-cols-1 gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm animate-fade-in"
            : "grid grid-cols-2 gap-2 p-2 bg-brand-surface rounded-lg"
    }>
        {participants.map((friend) => (
            <div key={friend.name} className="relative aspect-video bg-black rounded-md overflow-hidden group">
                {/* FIX: The ref callback should not return a value. Using a block statement `{ ... }` ensures a void return. */}
                {friend.isMe && stream ? <video ref={ref => { if (ref) ref.srcObject = stream; }} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" /> : <div className="w-full h-full flex items-center justify-center text-brand-text-secondary"><VideoOffIcon className="w-8 h-8"/></div>}
                {!friend.isMe && isHost && <button onClick={() => onRemoveParticipant(friend.name)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label={`Remove ${friend.name}`}><XIcon className="w-4 h-4" /></button>}
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-tr-md">{friend.name}</div>
            </div>
        ))}
    </div>
);

const ChatWindow: React.FC<{ messages: Message[]; onSendMessage: (text: string) => void; onGenerateIcebreaker: () => void; isGenerating: boolean; }> = ({ messages, onSendMessage, onGenerateIcebreaker, isGenerating }) => {
    const [newMessage, setNewMessage] = useState('');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (newMessage.trim()) { onSendMessage(newMessage.trim()); setNewMessage(''); } };
    return <div className="bg-brand-surface rounded-lg flex flex-col h-full p-4"><h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Group Chat</h3><div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">{messages.map(msg => <div key={msg.id} className={`flex flex-col ${msg.user.isMe ? 'items-end' : 'items-start'} animate-slide-up`}><div className={`rounded-lg px-3 py-2 max-w-xs md:max-w-sm ${msg.user.isMe ? 'bg-brand-primary text-white' : 'bg-gray-700 text-brand-text-primary'}`}><p className="text-sm">{msg.text}</p></div><span className="text-xs text-brand-text-secondary mt-1">{msg.user.name} - {msg.timestamp}</span></div>)}</div><div className="mt-auto"><button onClick={onGenerateIcebreaker} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 mb-2 px-4 py-2 bg-gradient-to-r from-brand-secondary to-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"><SparklesIcon className="w-5 h-5" />{isGenerating ? 'Thinking...' : 'AI Icebreaker'}</button><form onSubmit={handleSubmit} className="flex gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Say something..." className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" /><button type="submit" className="bg-brand-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">Send</button></form></div></div>;
};

const ControlBar: React.FC<{ isMuted: boolean; isVideoOff: boolean; toggleMute: () => void; toggleVideo: () => void; onLogout: () => void; }> = ({ isMuted, isVideoOff, toggleMute, toggleVideo, onLogout }) => (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-30 backdrop-blur-sm"><div className="max-w-4xl mx-auto flex justify-center"><div className="flex items-center space-x-2 bg-brand-surface rounded-full shadow-lg p-2"><button onClick={toggleMute} className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} aria-label={isMuted ? "Unmute" : "Mute"}>{isMuted ? <MicOffIcon /> : <MicIcon />}</button><button onClick={toggleVideo} className={`p-3 rounded-full transition-colors ${isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`} aria-label={isVideoOff ? "Turn video on" : "Turn video off"}>{isVideoOff ? <VideoOffIcon /> : <VideoIcon />}</button><button onClick={onLogout} className="p-3 rounded-full bg-gray-700 hover:bg-red-600 transition-colors" aria-label="Logout"><LogOutIcon /></button></div></div></div>
);

type LocalFiles = { videos: File[], images: File[], music: File[] };
const HostPanel: React.FC<{ isOpen: boolean; onAddParticipant: (name: string) => void; onActivityChange: (activity: ActivityType) => void; onShareInvite: () => void; currentActivity: ActivityType; localFiles: LocalFiles; onFileUpload: (files: FileList | null, type: 'video' | 'image' | 'music') => void; onSelectLocalFile: (file: File) => void; selectedLocalFile: File | null; onPlayFromUrl: (url: string) => void; }> = ({ isOpen, onAddParticipant, onActivityChange, onShareInvite, currentActivity, localFiles, onFileUpload, onSelectLocalFile, selectedLocalFile, onPlayFromUrl }) => {
    const [newFriendName, setNewFriendName] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'local' | 'streaming'>('general');
    const [urlInput, setUrlInput] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => { e.preventDefault(); onAddParticipant(newFriendName); setNewFriendName(''); };
    const handlePlayUrlSubmit = (e: React.FormEvent) => { e.preventDefault(); if (urlInput.trim()) { onPlayFromUrl(urlInput.trim()); setUrlInput(''); } };
    
    const renderTabContent = () => {
        const btnClass = "flex-1 text-left p-3 rounded-lg hover:bg-brand-primary/50 transition-colors flex items-center gap-3";
        const activeBtnClass = "bg-brand-primary";
        const activityButtons = [
            { type: 'general', id: ActivityType.Movies, icon: <FilmIcon />, label: 'Movies' },
            { type: 'general', id: ActivityType.Music, icon: <MusicIcon />, label: 'Music' },
            { type: 'general', id: ActivityType.Social, icon: <UsersIcon />, label: 'Social Feed' },
            { type: 'streaming', id: ActivityType.YouTube, icon: <YoutubeIcon className="text-red-500"/>, label: 'YouTube' },
            { type: 'streaming', id: ActivityType.PrimeVideo, icon: <PrimeVideoIcon className="text-blue-400"/>, label: 'Prime Video' },
        ];

        if (activeTab === 'local') {
            const mediaSections: { type: 'video' | 'image' | 'music', icon: React.ReactElement, accept: string }[] = [
                { type: 'video', icon: <FilmIcon className="w-5 h-5"/>, accept: 'video/*' },
                { type: 'image', icon: <ImageIcon className="w-5 h-5"/>, accept: 'image/*' },
                { type: 'music', icon: <MusicIcon className="w-5 h-5"/>, accept: 'audio/*' },
            ];

            return <div className="space-y-4">
                {mediaSections.map(section => (
                    <div key={section.type}>
                        <input type="file" id={`${section.type}-upload`} className="hidden" accept={section.accept} multiple onChange={(e) => onFileUpload(e.target.files, section.type)} />
                        <label htmlFor={`${section.type}-upload`} className="w-full cursor-pointer p-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                            <UploadCloudIcon className="w-5 h-5" /> Upload {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </label>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                            {localFiles[`${section.type}s`].length === 0 && <p className="text-xs text-center text-brand-text-secondary">No files uploaded.</p>}
                            {localFiles[`${section.type}s`].map(file => (
                                <button key={file.name} onClick={() => onSelectLocalFile(file)} className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 truncate ${selectedLocalFile?.name === file.name ? 'bg-brand-accent text-brand-bg' : 'bg-gray-900 hover:bg-brand-primary/50'}`}>
                                    {section.icon} <span className="truncate">{file.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        }
        
        if (activeTab === 'streaming') {
            return (
                <div className="space-y-4">
                    <form onSubmit={handlePlayUrlSubmit} className="flex gap-2">
                        <div className="relative flex-grow">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Paste any video URL..." className="w-full bg-gray-800 border-gray-700 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
                        </div>
                        <button type="submit" className="bg-brand-accent text-brand-bg p-2 rounded-lg font-bold hover:opacity-90 flex items-center gap-1">Play</button>
                    </form>
                    <div className="relative flex items-center"><div className="flex-grow border-t border-gray-700"></div><span className="flex-shrink mx-2 text-xs text-gray-500">OR</span><div className="flex-grow border-t border-gray-700"></div></div>
                    <div className="flex flex-col gap-2">{activityButtons.filter(b => b.type === activeTab).map(b => <button key={b.id} onClick={() => onActivityChange(b.id)} className={`${btnClass} ${currentActivity === b.id ? activeBtnClass : 'bg-gray-800'}`}>{b.icon} {b.label}</button>)}</div>
                </div>
            );
        }

        return <div className="flex flex-col gap-2">{activityButtons.filter(b => b.type === activeTab).map(b => <button key={b.id} onClick={() => onActivityChange(b.id)} className={`${btnClass} ${currentActivity === b.id ? activeBtnClass : 'bg-gray-800'}`}>{b.icon} {b.label}</button>)}</div>;
    }

    return <div className={`absolute top-0 left-0 right-0 bg-brand-surface/90 backdrop-blur-lg p-4 rounded-b-xl shadow-lg z-10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}><div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"><div id="friend-management"> <h4 className="font-bold text-lg mb-2">Manage Friends</h4><form onSubmit={handleAddSubmit} className="flex gap-2 mb-4"><input value={newFriendName} onChange={e => setNewFriendName(e.target.value)} placeholder="Friend's Name" className="flex-grow bg-gray-800 border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-secondary" /><button type="submit" className="bg-brand-accent text-brand-bg p-2 rounded-lg font-bold hover:opacity-90 flex items-center gap-1"><PlusIcon className="w-5 h-5"/>Add</button></form><button onClick={onShareInvite} className="w-full p-2 bg-gray-800 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"><Share2Icon/> Share Invite</button></div><div id="content-control"><div className="flex border-b border-gray-700 mb-2"><button onClick={() => setActiveTab('general')} className={`flex-1 py-2 ${activeTab === 'general' ? 'text-brand-accent border-b-2 border-brand-accent' : ''}`}>General</button><button onClick={() => setActiveTab('local')} className={`flex-1 py-2 ${activeTab === 'local' ? 'text-brand-accent border-b-2 border-brand-accent' : ''}`}>Local Media</button><button onClick={() => setActiveTab('streaming')} className={`flex-1 py-2 ${activeTab === 'streaming' ? 'text-brand-accent border-b-2 border-brand-accent' : ''}`}>Streaming</button></div>{renderTabContent()}</div></div></div>;
};

// --- Main App Component ---
// This is a simple in-memory store for users for demonstration purposes.
// In a real app, this would be a backend service.
const usersDb: { [userId: string]: { name: string; pass: string } } = {};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(ActivityType.Movies);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [isHostPanelOpen, setIsHostPanelOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [localFiles, setLocalFiles] = useState<LocalFiles>({ videos: [], images: [], music: [] });
  const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);
  const [webVideoUrl, setWebVideoUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load users database from local storage
    const storedUsers = localStorage.getItem('friendsmeet_users');
    if (storedUsers) {
      Object.assign(usersDb, JSON.parse(storedUsers));
    }

    // Check for a logged-in user
    const storedUser = localStorage.getItem('friendsmeet_user');
    if (storedUser) {
      setAuthenticatedUser(JSON.parse(storedUser));
    }
    
    const t1 = setTimeout(() => setIsFadingOut(true), 1500);
    const t2 = setTimeout(() => setIsLoading(false), 2000);

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => { 
        clearTimeout(t1); 
        clearTimeout(t2); 
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const addMessage = useCallback((user: User, text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), user, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  }, []);

  const setupMedia = useCallback(async (userName: string) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      addMessage({name: 'System'}, `Welcome back, ${userName}! Your session is restored.`);
    } catch (err) { addMessage({name: 'System'}, 'Camera/Mic access denied. Video chat will be disabled.'); }
  }, [addMessage]);
  
  useEffect(() => {
    if (authenticatedUser && !stream) { // Ensure media is set up only once
        setParticipants([{ name: authenticatedUser.name, isMe: true }]);
        setupMedia(authenticatedUser.name);
    }
  }, [authenticatedUser, setupMedia, stream]);

  // Effect for handling the synchronization status UI
  useEffect(() => {
    if (authenticatedUser) {
      setSyncStatus('syncing');
      const syncTimer = setTimeout(() => setSyncStatus('synced'), 500);
      return () => clearTimeout(syncTimer);
    }
  }, [currentActivity, authenticatedUser, selectedLocalFile, webVideoUrl]);

  useEffect(() => {
    if (syncStatus === 'synced') {
      const idleTimer = setTimeout(() => setSyncStatus('idle'), 1500);
      return () => clearTimeout(idleTimer);
    }
  }, [syncStatus]);

  const handleToggleFullscreen = () => {
    if (!fullscreenContainerRef.current) return;
    if (!document.fullscreenElement) {
        fullscreenContainerRef.current.requestFullscreen().catch(err => {
            addMessage({ name: 'System' }, `Error entering fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  const handleSendMessage = (text: string) => {
      if (authenticatedUser) {
        addMessage(authenticatedUser, text);
      }
  };
  const handleGenerateIcebreaker = useCallback(async () => { setIsGenerating(true); const q = await generateIcebreaker(currentActivity); addMessage({name: 'AI Assistant'}, q); setIsGenerating(false); }, [currentActivity, addMessage]);
  const toggleMute = () => { if (stream) { stream.getAudioTracks().forEach(t => t.enabled = !t.enabled); setIsMuted(p => !p); } };
  const toggleVideo = () => { if (stream) { stream.getVideoTracks().forEach(t => t.enabled = !t.enabled); setIsVideoOff(p => !p); } };
  
  const addParticipant = (name: string) => {
    if (name && !participants.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        setParticipants(prev => [...prev, { name }]);
        addMessage({name: 'System'}, `${name} has joined the session.`);
    }
  };
  const removeParticipant = (name: string) => {
    setParticipants(prev => prev.filter(p => p.name !== name));
    addMessage({name: 'System'}, `${name} has left the session.`);
  };

  const handleShareInvite = async () => {
    const inviteUrl = window.location.href;
    const inviteMessage = `Join my session on FriendsMeet Hub!`;

    if (navigator.share) {
        try {
            await navigator.share({ title: 'FriendsMeet Hub Invite', text: inviteMessage, url: inviteUrl });
            addMessage({ name: 'System' }, 'Invitation sent!');
        } catch (error) { console.error('Error sharing invitation:', error); addMessage({ name: 'System' }, 'Could not send invitation.'); }
    } else {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            addMessage({ name: 'System' }, 'Invite link copied to clipboard!');
        } catch (err) { console.error('Failed to copy invite link:', err); addMessage({ name: 'System' }, 'Could not copy invite link.'); }
    }
  };

  const handleRegister = (name: string, userId: string, pass: string): boolean => {
    if (usersDb[userId]) { return false; }
    usersDb[userId] = { name, pass };
    const user = { name, isMe: true };
    localStorage.setItem('friendsmeet_users', JSON.stringify(usersDb));
    localStorage.setItem('friendsmeet_user', JSON.stringify(user));
    setAuthenticatedUser(user);
    return true;
  };

  const handleLogin = (userId: string, pass: string): boolean => {
    const userRecord = usersDb[userId];
    if (userRecord && userRecord.pass === pass) {
      const user = { name: userRecord.name, isMe: true };
      localStorage.setItem('friendsmeet_user', JSON.stringify(user));
      setAuthenticatedUser(user);
      return true;
    }
    return false;
  };

  const handleGuestLogin = (name: string): boolean => {
    if (participants.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        return false;
    }
    const guestUser = { name, isMe: true };
    setAuthenticatedUser(guestUser);
    return true;
  };
  
  const handleLogout = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    localStorage.removeItem('friendsmeet_user');
    setAuthenticatedUser(null);
    setParticipants([]);
    setMessages([]);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleFileUpload = (files: FileList | null, type: 'video' | 'image' | 'music') => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    
    const isFirstUploadOfType = localFiles[`${type}s`].length === 0;

    setLocalFiles(prev => {
        const key = `${type}s` as keyof LocalFiles;
        const updatedFiles = [...prev[key], ...newFiles];
        const uniqueFiles = updatedFiles.filter((file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
        );
        return { ...prev, [key]: uniqueFiles };
    });

    if (isFirstUploadOfType) {
      handleSelectLocalFile(newFiles[0]);
    }
  };

  const handleSelectLocalFile = (file: File) => {
      setSelectedLocalFile(file);
      if (file.type.startsWith('video/')) {
          setCurrentActivity(ActivityType.LocalVideo);
      } else if (file.type.startsWith('image/')) {
          setCurrentActivity(ActivityType.LocalImage);
      } else if (file.type.startsWith('audio/')) {
          setCurrentActivity(ActivityType.LocalMusic);
      }
  };
  
  const handlePlayFromUrl = (url: string) => {
    const isValidUrl = (urlString: string) => {
        try {
            const newUrl = new URL(urlString);
            return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
        } catch (e) {
            return false;
        }
    };

    if (!isValidUrl(url)) {
        addMessage({name: 'System'}, "Invalid URL. Please enter a valid web address (http:// or https://).");
        return;
    }

    let embedUrl = url;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
            embedUrl = `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
        } else if (urlObj.hostname.includes("youtu.be")) {
            embedUrl = `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
        }
    } catch (error) {
        console.error("URL processing error:", error);
        addMessage({name: 'System'}, "There was an issue processing the URL.");
        return;
    }

    setWebVideoUrl(embedUrl);
    setCurrentActivity(ActivityType.WebVideo);
  };

  if (isLoading) return <SplashScreen isFadingOut={isFadingOut} />;
  if (!authenticatedUser) return <AuthView onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={handleGuestLogin} />;

  return (
    <div className="h-screen w-screen bg-brand-bg text-brand-text-primary">
        <div className={`h-full w-full flex flex-col md:flex-row p-2 sm:p-4 gap-4 ${isFullscreen ? 'fixed inset-0 bg-black z-50 p-0 gap-0' : ''}`}>
            <main ref={fullscreenContainerRef} className="flex-grow h-1/2 md:h-full flex flex-col gap-4 relative">
                <div className="flex-grow relative">
                    <div className={`absolute top-2 right-2 z-20 ${isFullscreen ? 'hidden' : ''}`}>
                        <button onClick={() => setIsHostPanelOpen(p => !p)} className="bg-brand-secondary text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform" aria-label="Toggle Host Controls">
                            {isHostPanelOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                    </div>
                    <div className={isFullscreen ? 'hidden' : ''}>
                        <HostPanel
                            isOpen={isHostPanelOpen}
                            onAddParticipant={addParticipant}
                            onActivityChange={setCurrentActivity}
                            onShareInvite={handleShareInvite}
                            currentActivity={currentActivity}
                            localFiles={localFiles}
                            onFileUpload={handleFileUpload}
                            onSelectLocalFile={handleSelectLocalFile}
                            selectedLocalFile={selectedLocalFile}
                            onPlayFromUrl={handlePlayFromUrl}
                        />
                    </div>
                    <MediaViewer
                        activity={currentActivity}
                        syncStatus={syncStatus}
                        selectedLocalFile={selectedLocalFile}
                        webVideoUrl={webVideoUrl}
                        onToggleFullscreen={handleToggleFullscreen}
                        isFullscreen={isFullscreen}
                    />
                    <div className={isFullscreen ? 'hidden' : ''}>
                        <ControlBar isMuted={isMuted} isVideoOff={isVideoOff} toggleMute={toggleMute} toggleVideo={toggleVideo} onLogout={handleLogout} />
                    </div>
                    {isFullscreen && (
                        <VideoGrid stream={stream} participants={participants} onRemoveParticipant={removeParticipant} isHost={true} isFullscreen={true} />
                    )}
                </div>
            </main>
            <aside className={`w-full md:w-80 lg:w-96 flex-shrink-0 h-1/2 md:h-full flex-col gap-4 ${isFullscreen ? 'hidden' : 'flex'}`}>
                <VideoGrid stream={stream} participants={participants} onRemoveParticipant={removeParticipant} isHost={true} isFullscreen={false} />
                <ChatWindow messages={messages} onSendMessage={handleSendMessage} onGenerateIcebreaker={handleGenerateIcebreaker} isGenerating={isGenerating} />
            </aside>
        </div>
    </div>
  );
};

export default App;