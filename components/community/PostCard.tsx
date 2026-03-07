
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../services/socialService';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(post.likes || 0);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (voteStatus === type) {
      setVoteStatus(null);
      setUpvotes(prev => type === 'up' ? prev - 1 : prev + 1);
    } else {
      const diff = type === 'up' ? 1 : -1;
      const initialDiff = voteStatus ? (type === 'up' ? 2 : -2) : diff;
      setUpvotes(prev => prev + initialDiff);
      setVoteStatus(type);
    }
  };

  return (
    <div className="bg-[#0b1416] border border-transparent hover:border-[#343536] rounded-md transition-all mb-4 group overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Community Icon */}
          <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {post.community?.avatar ? (
              <img src={post.community.avatar} alt={post.community.name} className="size-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-primary">r/</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[12px]">
            <span className="font-bold text-[#D7DADC] hover:underline cursor-pointer">
              r/{post.community?.slug || post.author.username}
            </span>
            <span className="text-[#717273]">•</span>
            <span className="text-[#717273] hover:underline cursor-pointer">
              {/* post.createdAt is a string like "2026-03-07T..." */}
              {new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[#717273]">•</span>
            <span className="text-[#717273] font-medium cursive italic">Suggested for you</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#0079D3] hover:bg-[#1484D6] text-white text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors">
            Join
          </button>
          <button className="text-[#818384] hover:bg-[#1A1A1B] p-1 rounded-full">
            <span className="material-symbols-outlined !text-[20px]">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Post Title */}
      <div className="px-4 pb-2">
        <h3 className="text-[18px] font-bold text-[#D7DADC] leading-tight mb-2">
          {post.title || post.content.substring(0, 50) + "..."}
        </h3>
      </div>

      {/* Post Content / Media */}
      <div className="px-4 pb-2">
        {post.mediaUrl ? (
          <div className="rounded-xl overflow-hidden bg-[#1A1A1B] border border-[#343536]">
            <img src={post.mediaUrl} alt="Post media" className="w-full h-auto max-h-[512px] object-contain mx-auto" />
          </div>
        ) : post.codeSnippet ? (
          <div className="rounded-xl overflow-hidden bg-[#1A1A1B] border border-[#343536] p-4 font-mono text-[13px] text-[#A8AAAB]">
            <div className="flex justify-between items-center mb-2 border-b border-[#343536] pb-2">
              <span className="text-secondary">{post.codeSnippet.language}</span>
              <span className="material-symbols-outlined !text-[16px]">content_copy</span>
            </div>
            <pre><code>{post.codeSnippet.code}</code></pre>
          </div>
        ) : (
          <p className="text-[14px] text-[#D7DADC] leading-relaxed">
            {post.content}
          </p>
        )}
      </div>

      {/* Action Bar (Reddit Style) */}
      <div className="flex items-center px-4 py-2 gap-2">
        {/* Voting Pill */}
        <div className="flex items-center bg-[#1A1A1B] hover:bg-[#272729] rounded-full p-0.5">
          <button
            onClick={() => handleVote('up')}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${voteStatus === 'up' ? 'text-[#FF4500]' : 'text-[#818384] hover:bg-[#343536]'}`}
          >
            <span className={`material-symbols-outlined !text-[20px] ${voteStatus === 'up' ? 'filled' : ''}`}>arrow_upward</span>
          </button>
          <span className={`text-[12px] font-bold px-1 ${voteStatus === 'up' ? 'text-[#FF4500]' : voteStatus === 'down' ? 'text-[#7193FF]' : 'text-[#D7DADC]'}`}>
            {upvotes}
          </span>
          <button
            onClick={() => handleVote('down')}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${voteStatus === 'down' ? 'text-[#7193FF]' : 'text-[#818384] hover:bg-[#343536]'}`}
          >
            <span className={`material-symbols-outlined !text-[20px] ${voteStatus === 'down' ? 'filled' : ''}`}>arrow_downward</span>
          </button>
        </div>

        {/* Comments Pill */}
        <button className="flex items-center gap-2 bg-[#1A1A1B] hover:bg-[#272729] px-3 py-1.5 rounded-full text-[#818384] transition-colors">
          <span className="material-symbols-outlined !text-[20px]">chat_bubble</span>
          <span className="text-[12px] font-bold">{post.comments?.length || 0}</span>
        </button>

        {/* Awards/Awards Counter (Mock) */}
        <button className="flex items-center gap-2 bg-[#1A1A1B] hover:bg-[#272729] px-3 py-1.5 rounded-full text-[#818384] transition-colors">
          <span className="material-symbols-outlined !text-[20px]">workspace_premium</span>
          {/* Maybe a random small number or just the icon */}
          <span className="text-[12px] font-bold">1</span>
        </button>

        {/* Share Pill */}
        <button className="flex items-center gap-2 bg-[#1A1A1B] hover:bg-[#272729] px-3 py-1.5 rounded-full text-[#818384] transition-colors">
          <span className="material-symbols-outlined !text-[20px]">share</span>
          <span className="text-[12px] font-bold">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
