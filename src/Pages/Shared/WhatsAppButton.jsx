import { useState } from 'react';
import { MessageCircle, Share2, Check } from 'lucide-react';
import { pushToDataLayer, trackAddToCart } from '../../utils/gtm';

const WhatsAppContactButton = ({ book }) => {
    const whatsappNumber = "8801810728222";
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const bookTitle = book?.title || "বইটি";
    const bookPrice = book?.price || "মূল্য জানতে চাই";

    const message = `আসসালামু আলাইকুম! আমি "${bookTitle}" (মূল্য: ৳${bookPrice}) বইটি সম্পর্কে জানতে চাই/অর্ডার করতে চাই।\nলিংক: ${currentUrl}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // ─── 1. WhatsApp Click Handler with GA4 DataLayer Event ───────────
    const handleWhatsAppClick = () => {
        // Fire GA4 Standard add_to_cart event ONLY on click
        if (book) {
            trackAddToCart(book, 1);

            // Optional: Custom event to specifically track WhatsApp order leads
            pushToDataLayer('whatsapp_lead_click', {
                book_id: book._id,
                book_title: book.title,
                price: Number(book.price) || 0,
            });
        }
    };



    return (
        <div className="flex items-center gap-2 w-full xl:w-auto flex-1">
            {/* WhatsApp Order Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick} // <-- Attached click listener here
                className="inline-flex h-12 w-full flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm py-2 font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#20bd5a] hover:shadow-md active:scale-95 border border-[#20bd5a]"
            >
                <MessageCircle className="h-4 w-4 fill-current shrink-0" />
                <span className="whitespace-nowrap">হোয়াটসঅ্যাপে অর্ডার</span>
            </a>


        </div>
    );
};

export default WhatsAppContactButton;