import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socialService, Community, Post } from '../../services/social/socialService';
import { profileService, UserProfile } from '../../services/activity/profile';
import PostCard from './PostCard';

const CommunityPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!slug) return;
        loadCommunityData();
        setCurrentUser(profileService.getProfile());

        const unsubscribe = profileService.subscribe((updatedProfile) => {
            setCurrentUser(updatedProfile);
        });

        return () => unsubscribe();
    }, [slug]);

    const loadCommunityData = async () => {
        setLoading(true);
        try {
            // First try to fetch the specific community (this endpoint might need adjustment depending on backend)
            const allCommunities = await socialService.getCommunities();
            const found = allCommunities.find(c => c.slug === slug);

            if (found) {
                setCommunity(found);

                // Fetch posts for this community. The socialService.getFeed() currently returns a general feed. 
                // We'd ideally want to fetch by communityId here. For now we will fetch feed and filter,
                // but a dedicated endpoint is better.
                try {
                    const allPosts = await socialService.getFeed();
                    setPosts(allPosts.filter(p => p.community?.id === found.id));
                } catch (e) {
                    console.error("Failed to fetch posts:", e);
                }
            } else {
                console.error("Community not found with slug:", slug);
                // Optionally navigate to a 404 or show an error
            }
        } catch (e) {
            console.error("Failed to load community:", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto bg-[#030303] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center py-20 text-[#818384]">
                    <span className="material-symbols-outlined !text-4xl animate-spin mb-4 text-primary">
                        progress_activity
                    </span>
                    <p className="font-bold">Loading community...</p>
                </div>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="flex-1 overflow-y-auto bg-[#030303] flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Community not found</h2>
                    <button onClick={() => navigate('/community')} className="bg-primary px-4 py-2 rounded-full font-bold">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#0B1426] relative">
            {/* Banner Area */}
            <div className="h-[200px] w-full bg-[#1A2844] relative group">
                {community.coverImage ? (
                    <img src={community.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
                )}
                {/* Optional edit button if user is admin */}
                <button className="absolute bottom-4 right-4 size-8 rounded-full bg-[#0F1A30] border border-[#274276] flex items-center justify-center text-white hover:bg-[#1A2844] transition-colors">
                    <span className="material-symbols-outlined !text-[16px]">edit</span>
                </button>
            </div>

            {/* Header Content Wrapper */}
            <div className="bg-[#0B1426] border-b border-[#1A2844]">
                <div className="max-w-[1000px] mx-auto px-6 relative">
                    {/* Avatar Header Layout */}
                    <div className="flex items-end justify-between -mt-10 pb-4">
                        <div className="flex items-end gap-4">
                            <div className="relative group">
                                <img
                                    src={community.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}`}
                                    alt="Avatar"
                                    className="size-[88px] rounded-full border-4 border-[#0B1426] bg-[#0B1426] object-cover"
                                />
                                {/* Optional edit button over avatar if admin */}
                            </div>
                            <div className="pb-1">
                                <h1 className="text-3xl font-extrabold text-white">{community.name}</h1>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pb-2">
                            <button
                                onClick={() => navigate(`/community?action=create-post&community=${slug}`)}
                                className="h-10 px-4 rounded-full border border-white text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined !text-[20px]">add</span>
                                Create Post
                            </button>
                            <button className="size-10 rounded-full border border-[#274276] bg-[#0F1A30] flex items-center justify-center text-white hover:bg-[#1A2844] transition-colors">
                                <span className="material-symbols-outlined !text-[20px]">notifications_off</span>
                            </button>
                            <button className="h-10 px-4 rounded-full bg-[#0045D8] text-white font-bold text-sm hover:bg-[#0038B3] transition-colors">
                                Mod Tools
                            </button>
                            <button className="size-10 rounded-full border border-[#274276] bg-[#0F1A30] flex items-center justify-center text-white hover:bg-[#1A2844] transition-colors">
                                <span className="material-symbols-outlined !text-[20px]">more_horiz</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-[1000px] mx-auto px-6 py-6 flex gap-6">
                {/* Main Feed Area */}
                <div className="flex-1 shrink-0 min-w-0">
                    <div className="flex items-center gap-4 mb-6 text-[#A1A1AA] text-sm font-semibold">
                        <button className="flex items-center gap-1 text-white hover:text-white transition-colors">
                            Best <span className="material-symbols-outlined !text-[16px]">expand_more</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <span className="material-symbols-outlined !text-[18px]">calendar_view_day</span> <span className="material-symbols-outlined !text-[16px]">expand_more</span>
                        </button>
                    </div>

                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold text-white mb-2">This community doesn't have any posts yet</h2>
                            <p className="text-[#A1A1AA] mb-6">Make one and get this feed started.</p>
                            <button
                                onClick={() => navigate(`/community?action=create-post&community=${slug}`)}
                                className="h-10 px-6 rounded-full bg-[#0045D8] text-white font-bold text-sm hover:bg-[#0038B3] transition-colors"
                            >
                                Create Post
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar Info */}
                <div className="w-[312px] shrink-0 space-y-4 hidden lg:block">
                    {/* Build Community Widget */}
                    <div className="bg-[#0F1A30] border border-[#274276] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[14px] font-bold text-white">Build your community</h2>
                            <span className="material-symbols-outlined !text-[20px] text-white cursor-pointer">expand_more</span>
                        </div>
                        <div className="w-full h-1 bg-[#274276] rounded-full mb-4 overflow-hidden">
                            <div className="h-full w-1/4 bg-[#3B66ED] rounded-full"></div>
                        </div>
                        <button className="w-full h-9 rounded-full border border-white text-white font-bold text-sm hover:bg-white/10 transition-colors">
                            View Mod Toolkit
                        </button>
                    </div>

                    {/* Community Info Widget */}
                    <div className="bg-[#0F1A30] border border-[#274276] rounded-xl p-4">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-bold text-white mb-1">{community.name}</h2>
                                <p className="text-sm text-[#A1A1AA]">{community.slug}</p>
                            </div>
                            <button className="size-8 rounded-full bg-[#1A2844] flex items-center justify-center text-white hover:bg-[#274276] transition-colors">
                                <span className="material-symbols-outlined !text-[16px]">edit</span>
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                                <span className="material-symbols-outlined !text-[18px]">cake</span>
                                <span>Created {new Date(community.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                                <span className="material-symbols-outlined !text-[18px]">public</span>
                                <span>Public</span>
                            </div>
                        </div>

                        <button className="w-full h-9 rounded-full bg-[#1A2844] text-white font-bold text-sm hover:bg-[#274276] transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined !text-[18px]">menu_book</span>
                            Community Guide
                        </button>

                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-[12px] font-bold text-white">Insights</h3>
                                <span className="text-[12px] text-[#A1A1AA] cursor-pointer">Past week &gt;</span>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-lg font-bold text-white">0</div>
                                    <div className="text-[12px] text-[#A1A1AA]">Visitors</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">0</div>
                                    <div className="text-[12px] text-[#A1A1AA]">Contributions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
