import React from 'react';
import { MessageCircle } from 'lucide-react'; // অথবা আপনার পছন্দের আইকন

const WhatsAppContactButton = ({ book }) => {
    // আপনার শপের বা সাপোর্ট টিমের হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ, কোনো space বা - ছাড়া)
    const whatsappNumber = "8801710728222";

    // প্রোডাক্টের লিংক ও টাইটেল
    const currentUrl = window.location.href;
    const bookTitle = book?.title || "বইটি";
    const bookPrice = book?.price || "মূল্য জানতে চাই";

    // মেসেজ ফরম্যাট (কাস্টমার ক্লিক করলে অটোমেটিক এই মেসেজ টাইপ হয়ে থাকবে)
    const message = `আসসালামু আলাইকুম! আমি "${bookTitle}" (মূল্য: ৳${bookPrice}) বইটি সম্পর্কে জানতে চাই/অর্ডার করতে চাই।\nলিংক: ${currentUrl}`;

    // হোয়াটসঅ্যাপ ইউআরএল
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#20bd5a] hover:shadow-lg active:scale-95"
        >
            <MessageCircle className="h-5 w-5 fill-current" />
            <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
        </a>
    );
};

export default WhatsAppContactButton;