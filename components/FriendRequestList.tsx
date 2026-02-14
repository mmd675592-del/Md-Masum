
import React from 'react';
import { UserInfo } from '../types';

interface FriendRequestListProps {
  requests: UserInfo[];
  suggestions: UserInfo[];
  onBack: () => void;
  onNavigateToProfile: (userId: string) => void;
  onFriendshipAction: (userId: string, action: 'send' | 'accept' | 'delete' | 'cancel') => void;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({ 
  requests, suggestions, onBack, onNavigateToProfile, onFriendshipAction 
}) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex-1 text-left">Friends</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-green-600">
           <i className="fa-solid fa-magnifying-glass text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Friend Requests Section */}
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="text-xl font-bold text-gray-800">Friend Requests</h3>
          <button className="text-green-600 font-bold text-sm">See All</button>
        </div>

        <div className="divide-y divide-gray-100">
          {requests.map((req) => (
            <div key={req.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
              <div 
                onClick={() => onNavigateToProfile(req.id)}
                className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 cursor-pointer"
              >
                <img src={req.avatar} alt={req.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 
                    onClick={() => onNavigateToProfile(req.id)}
                    className="font-bold text-gray-900 text-[16px] cursor-pointer hover:underline"
                  >
                    {req.name}
                  </h4>
                  <span className="text-xs text-gray-400 font-medium">Just now</span>
                </div>
                
                {req.mutualFriends !== undefined && req.mutualFriends > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">{req.mutualFriends} mutual friends</p>
                )}

                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => onFriendshipAction(req.id, 'accept')}
                    className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-sm shadow-sm hover:bg-blue-700 transition-colors active:scale-95"
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => onFriendshipAction(req.id, 'delete')}
                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">No new friend requests</div>
          )}
        </div>

        {/* Suggestions Section */}
        <div className="mt-4 p-4 border-t-8 border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">People You May Know</h3>
          
          <div className="divide-y divide-gray-100">
            {suggestions.map((user) => (
              <div key={user.id} className="py-4 flex gap-4 items-center">
                <div 
                  onClick={() => onNavigateToProfile(user.id)}
                  className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 cursor-pointer"
                >
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                   <h4 
                    onClick={() => onNavigateToProfile(user.id)}
                    className="font-bold text-gray-900 text-[16px] cursor-pointer hover:underline"
                  >
                    {user.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{user.mutualFriends || 0} mutual friends</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => onFriendshipAction(user.id, user.friendshipStatus === 'sent' ? 'cancel' : 'send')}
                      className={`flex-1 ${user.friendshipStatus === 'sent' ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'} font-bold py-2 rounded-lg text-sm transition-all active:scale-95 flex items-center justify-center gap-2`}
                    >
                      <i className={`fa-solid ${user.friendshipStatus === 'sent' ? 'fa-user-minus' : 'fa-user-plus'} text-xs`}></i>
                      {user.friendshipStatus === 'sent' ? 'Cancel Request' : 'Add Friend'}
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg text-sm">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequestList;
