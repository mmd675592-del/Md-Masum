
import React from 'react';

const stores = [
  { id: 'add', name: 'Create Story', image: '', isOwner: true },
  { id: '1', name: 'Akash', time: '10m', image: 'https://i.pravatar.cc/150?u=akash' },
  { id: '2', name: 'MD ROHIT', time: '2m', image: 'https://i.pravatar.cc/150?u=rohit' },
  { id: '3', name: 'Runa', time: '2m', image: 'https://i.pravatar.cc/150?u=runa' },
  { id: '4', name: 'Farso', time: '1h', image: 'https://i.pravatar.cc/150?u=farso' },
  { id: '5', name: 'Bijoy', time: '5m', image: 'https://i.pravatar.cc/150?u=bijoy' },
];

const StoreSection: React.FC = () => {
  return (
    <div className="bg-white py-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 min-w-max">
        {stores.map((store) => (
          <div 
            key={store.id} 
            className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden shadow-sm group cursor-pointer transition-transform active:scale-95"
          >
            <img 
              src={store.isOwner 
                ? 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop' 
                : `https://picsum.photos/seed/${store.id}/400/600`
              } 
              alt={store.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
            
            <div className="absolute top-2 left-2 w-10 h-10 rounded-lg border-2 border-green-500 overflow-hidden bg-white z-10 shadow-md">
              {store.isOwner ? (
                <div className="w-full h-full bg-white flex items-center justify-center text-green-600">
                  <i className="fa-solid fa-plus text-lg"></i>
                </div>
              ) : (
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              )}
            </div>
            
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <p className="text-white text-xs font-bold leading-tight drop-shadow-lg truncate">
                {store.name}
              </p>
              {!store.isOwner && (
                <p className="text-white/80 text-[10px] drop-shadow-lg">
                  {store.time}
                </p>
              )}
            </div>

            {store.isOwner && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="bg-green-600/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">All Store</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreSection;
