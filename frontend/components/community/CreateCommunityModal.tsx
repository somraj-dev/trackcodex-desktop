import React, { useState } from 'react';
import { socialService, Community } from '../../services/social/socialService';

interface CreateCommunityModalProps {
    onClose: () => void;
    onCommunityCreated: (community: Community) => void;
}

const TOPICS = [
    { id: 'anime', label: 'Anime & Cosplay', icon: 'animation' },
    { id: 'art', label: 'Art', icon: 'palette' },
    { id: 'business', label: 'Business & Finance', icon: 'payments' },
    { id: 'collectibles', label: 'Collectibles', icon: 'stars' },
    { id: 'education', label: 'Education & Career', icon: 'school' },
    { id: 'fashion', label: 'Fashion & Beauty', icon: 'checkroom' },
    { id: 'food', label: 'Food & Drinks', icon: 'restaurant' },
    { id: 'games', label: 'Games', icon: 'sports_esports' },
    { id: 'health', label: 'Health', icon: 'favorite' },
    { id: 'home', label: 'Home & Garden', icon: 'home' },
    { id: 'law', label: 'Humanities & Law', icon: 'gavel' },
    { id: 'culture', label: 'Internet Culture', icon: 'language' },
    { id: 'movies', label: 'Movies & TV', icon: 'movie' },
    { id: 'music', label: 'Music', icon: 'music_note' },
    { id: 'nature', label: 'Nature & Outdoors', icon: 'forest' },
    { id: 'news', label: 'News & Politics', icon: 'newspaper' },
    { id: 'travel', label: 'Places & Travel', icon: 'explore' },
    { id: 'pop', label: 'Pop Culture', icon: 'celebration' },
    { id: 'qa', label: 'Q&As & Stories', icon: 'quiz' },
    { id: 'reading', label: 'Reading & Writing', icon: 'menu_book' },
    { id: 'sciences', label: 'Sciences', icon: 'science' },
    { id: 'spooky', label: 'Spooky', icon: 'skull' },
    { id: 'sports', label: 'Sports', icon: 'sports_soccer' },
    { id: 'tech', label: 'Technology', icon: 'terminal' },
    { id: 'vehicles', label: 'Vehicles', icon: 'directions_car' },
    { id: 'wellness', label: 'Wellness', icon: 'self_improvement' },
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose, onCommunityCreated }) => {
    const [step, setStep] = useState(1);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [visibility, setVisibility] = useState('public'); // public, restricted, private
    const [isMature, setIsMature] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [createdCommunity, setCreatedCommunity] = useState<Community | null>(null);

    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const bannerInputRef = React.useRef<HTMLInputElement>(null);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'avatar') {
                setAvatarUrl(url);
                if (createdCommunity) {
                    await socialService.updateCommunity(createdCommunity.slug, { avatar: url });
                }
            } else {
                setBannerUrl(url);
                if (createdCommunity) {
                    await socialService.updateCommunity(createdCommunity.slug, { coverImage: url });
                }
            }
        }
    };

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const community = await socialService.createCommunity({
                name,
                description,
            });
            setCreatedCommunity(community);
            onCommunityCreated(community);
            setStep(4); // Move to configuration/success step
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">What will your community be about?</h2>
                        <p className="text-sm text-[#A1A1AA] mb-6">Choose a topic to help members discover your community.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                            {TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-[13px] font-medium transition-all ${selectedTopic === topic.id
                                        ? 'bg-white text-black border-white'
                                        : 'bg-[#111111] text-[#D7DADC] border-[#1A1A1A] hover:border-[#333333]'
                                        }`}
                                >
                                    <span className="material-symbols-outlined !text-[18px]">{topic.icon}</span>
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">What kind of community is this?</h2>
                        <p className="text-sm text-[#A1A1AA] mb-6">Decide who can view and contribute to your community.</p>

                        <div className="space-y-4">
                            {[
                                { id: 'public', label: 'Public', desc: 'Anyone can view, post, and comment', icon: 'public' },
                                { id: 'restricted', label: 'Restricted', desc: 'Anyone can view, but only approved users can contribute', icon: 'visibility' },
                                { id: 'private', label: 'Private', desc: 'Only approved users can view and contribute', icon: 'lock' },
                            ].map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setVisibility(v.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-md border transition-all ${visibility === v.id
                                        ? 'bg-[#111111] border-white'
                                        : 'bg-transparent border-[#1A1A1A] hover:border-[#333333]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <span className={`material-symbols-outlined ${visibility === v.id ? 'text-white' : 'text-[#818384]'}`}>{v.icon}</span>
                                        <div>
                                            <div className="text-[14px] font-bold text-white">{v.label}</div>
                                            <div className="text-[12px] text-[#A1A1AA]">{v.desc}</div>
                                        </div>
                                    </div>
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${visibility === v.id ? 'border-white' : 'border-[#333333]'}`}>
                                        {visibility === v.id && <div className="size-2.5 rounded-full bg-white"></div>}
                                    </div>
                                </button>
                            ))}

                            <div className="pt-4 border-t border-[#1A1A1A] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#818384] text-[20px]">warning</span>
                                    <div>
                                        <div className="text-[14px] font-bold text-white">Mature (18+)</div>
                                        <div className="text-[12px] text-[#A1A1AA]">Users must be over 18 to view</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMature(!isMature)}
                                    aria-label="Toggle mature content"
                                    className={`w-10 h-6 rounded-full transition-colors relative ${isMature ? 'bg-primary' : 'bg-[#333333]'}`}
                                >
                                    <div className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform ${isMature ? 'translate-x-4' : ''}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-white mb-2">Tell us about your community</h2>
                        <p className="text-sm text-[#A1A1AA] mb-6">A name and description help people understand what your community is all about.</p>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[#A1A1AA] uppercase block mb-2">Community Name *</label>
                                    <input
                                        maxLength={21}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="community_name"
                                        className="w-full bg-[#111111] border border-[#1A1A1A] rounded-md px-4 py-3 text-[14px] text-white focus:outline-none focus:border-white transition-colors"
                                    />
                                    <div className="text-[10px] text-[#717273] mt-1 text-right">{name.length}/21</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#A1A1AA] uppercase block mb-2">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell us what this community is for..."
                                        className="w-full bg-[#111111] border border-[#1A1A1A] rounded-md px-4 py-3 text-[14px] text-white min-h-[120px] focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-[280px] shrink-0">
                                <label className="text-xs font-bold text-[#A1A1AA] uppercase block mb-2">Preview</label>
                                <div className="bg-[#1A1A1B] border border-[#343536] rounded-md overflow-hidden">
                                    <div className="h-10 bg-[#333333]"></div>
                                    <div className="p-4 pt-0 -mt-5">
                                        <div className="flex items-end gap-2 mb-3">
                                            <div className="size-12 rounded-full bg-[#272729] border-2 border-[#1A1A1B] flex items-center justify-center text-white font-bold overflow-hidden">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    name ? name[0].toUpperCase() : 'C'
                                                )}
                                            </div>
                                            <div className="pb-1">
                                                <div className="text-[14px] font-bold text-white">c/{name || 'communityname'}</div>
                                                <div className="text-[10px] text-[#A1A1AA]">0 members • 1 online</div>
                                            </div>
                                        </div>
                                        <p className="text-[12px] text-[#D7DADC] line-clamp-3 min-h-[45px]">
                                            {description || 'Your community description will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-in fade-in h-full flex flex-col pt-0">
                        <div className="flex flex-col md:flex-row h-full min-h-[500px] w-full bg-[#0F0F0F] rounded-[18px] overflow-hidden">
                            {/* Left Pane */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
                                <h2 className="text-[32px] font-extrabold text-white leading-tight mb-8 font-sans">
                                    You launched a new<br />community!
                                </h2>
                                <div className="space-y-4 max-w-[340px]">
                                    <h3 className="text-[16px] font-bold text-white tracking-wide">Here's what you should know</h3>
                                    <p className="text-[#D7DADC] text-[15px] leading-snug">
                                        We've applied some settings to help you get started.
                                        You can view and edit them anytime in your mod tools.
                                    </p>
                                    <div className="flex gap-4 pt-4">
                                        <div className="flex-1 px-4 py-3 rounded-xl border border-[#333333] bg-[#1A1A1B] flex items-center gap-3">
                                            <span className="material-symbols-outlined text-green-500 font-bold !text-[20px]">check</span>
                                            <span className="text-white text-[14px] font-medium">Rules</span>
                                        </div>
                                        <div className="flex-1 px-4 py-3 rounded-xl border border-[#333333] bg-[#1A1A1B] flex items-center gap-3">
                                            <span className="material-symbols-outlined text-green-500 font-bold !text-[20px]">check</span>
                                            <span className="text-white text-[14px] font-medium">Welcome guide</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane */}
                            <div className="w-full md:w-[460px] bg-[#274276] p-8 md:p-10 flex flex-col items-center justify-center relative shadow-inner">
                                <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 text-white hover:bg-black/20 bg-black/30 z-50 size-9 rounded-full flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined !text-[20px]">close</span>
                                </button>

                                <div className="w-full max-w-[360px] bg-[#1A1A1B] rounded-2xl overflow-hidden shadow-2xl relative border border-[#343536]">
                                    {/* Banner Area */}
                                    <div className="h-32 relative bg-[#EEEEEE] w-full overflow-hidden">
                                        {/* Default repeating bubble pattern if no banner */}
                                        {!bannerUrl && (
                                            <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-2 p-3 opacity-80">
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className={`h-8 rounded-xl rounded-bl-sm bg-[#D5D5D5] ${i % 3 === 0 ? 'w-16' : i % 2 === 0 ? 'w-24' : 'w-12'}`}></div>
                                                ))}
                                            </div>
                                        )}
                                        {bannerUrl && (
                                            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                                        )}
                                        {/* Edit Banner Button overlaying the banner image bottom right */}
                                        <button
                                            className="absolute bottom-3 right-3 size-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
                                            onClick={() => bannerInputRef.current?.click()}
                                            title="Edit banner"
                                        >
                                            <span className="material-symbols-outlined !text-[18px]">edit</span>
                                        </button>
                                        <input
                                            type="file"
                                            ref={bannerInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            title="Upload banner"
                                            aria-label="Upload banner"
                                            onChange={(e) => handleFileChange(e, 'banner')}
                                        />
                                    </div>

                                    {/* Card Content underneath banner */}
                                    <div className="px-6 pb-6 relative">
                                        <div className="flex items-end gap-3 -mt-8 mb-4 relative z-20">
                                            {/* Avatar Area */}
                                            <div className="relative group shrink-0">
                                                <div className="size-20 rounded-full bg-[#1A1A1B] border-[4px] border-[#1A1A1B] overflow-hidden flex items-center justify-center text-3xl font-bold text-white shadow-sm relative z-10">
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="size-full bg-blue-400 flex items-center justify-center">
                                                            {name ? name[0].toUpperCase() : 'C'}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    className="absolute bottom-0 right-0 size-8 rounded-full bg-[#333333] hover:bg-[#444444] flex items-center justify-center text-white border-[3px] border-[#1A1A1B] transition-colors cursor-pointer z-20"
                                                    onClick={() => avatarInputRef.current?.click()}
                                                    title="Edit avatar"
                                                >
                                                    <span className="material-symbols-outlined !text-[14px]">edit</span>
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={avatarInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    title="Upload avatar"
                                                    aria-label="Upload avatar"
                                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                                />
                                            </div>

                                            {/* Title and stats */}
                                            <div className="mb-2">
                                                <h4 className="text-[20px] font-bold text-white leading-tight font-sans">r/{name || 'community'}</h4>
                                                <div className="text-[13px] text-[#A1A1AA] font-normal truncate mt-0.5">
                                                    1 weekly visitor • 1 weekly contributor
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-[14px] text-[#D7DADC] line-clamp-3 mb-6 font-normal">
                                            {name || 'community'}
                                        </p>

                                        {/* Base Color Button */}
                                        <button className="w-full py-3 rounded-full border border-[#333333] bg-transparent hover:bg-[#222222] text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors">
                                            <span className="material-symbols-outlined !text-[20px]">edit</span>
                                            Base Color
                                            <div className="size-4 rounded-full bg-[#3B66ED] ml-1 border border-[#1A1A1B]"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`bg-[#111111] overflow-hidden w-full ${step === 4 ? 'max-w-[850px]' : 'max-w-[650px] border border-[#1A1A1A]'} rounded-[18px] shadow-2xl flex flex-col transition-all duration-300`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-5 ${step === 4 ? 'hidden' : 'border-b border-[#1A1A1A]'}`}>
                    {step < 4 ? (
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-white' : s < step ? 'w-3 bg-white/40' : 'w-3 bg-[#1A1A1A]'
                                        }`}
                                />
                            ))}
                        </div>
                    ) : null}
                    <button onClick={onClose} aria-label="Close modal" className="text-[#818384] hover:text-white transition-colors bg-[#1A1A1B] size-8 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined !text-[18px]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className={`${step === 4 ? 'p-0 relative bg-[#0F0F0F] rounded-t-[18px]' : 'p-8'} flex-1`}>
                    {renderStep()}
                </div>

                {/* Footer */}
                <div className={`p-5 px-6 flex items-center ${step === 4 ? 'bg-[#0F0F0F] rounded-b-[18px] border-t border-[#1A1A1A] justify-end' : 'border-t border-[#1A1A1A] bg-[#0A0A0A] justify-between'}`}>
                    {step === 4 ? (
                        <div className="w-full flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-full text-white text-[14px] font-bold hover:bg-[#1A1A1B] transition-colors"
                            >
                                Go To Community Page
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-full bg-[#333333] hover:bg-[#444444] text-white text-[14px] font-bold transition-colors"
                            >
                                View Next Steps
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={step === 1 ? onClose : prevStep}
                                className="px-6 py-2.5 rounded-full border border-[#1A1A1A] text-white text-[14px] font-bold hover:bg-[#111111] transition-colors"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>
                            <div className="flex gap-3">
                                {step < 3 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={step === 1 && !selectedTopic}
                                        className="px-8 py-2.5 rounded-full bg-white text-black text-[14px] font-bold hover:bg-[#E5E5E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCreate}
                                        disabled={loading || !name.trim() || !description.trim()}
                                        className="px-8 py-2.5 rounded-full bg-white text-black text-[14px] font-bold hover:bg-[#E5E5E5] transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        {loading ? 'Creating...' : 'Create Community'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
