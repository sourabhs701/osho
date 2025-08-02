import { useEffect, useState } from "react";

export default function TextDisplay({ textUrl }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!textUrl) return;

        const fetchText = async () => {
            setLoading(true);
            setError(null);


            const cachedText = localStorage.getItem(`cachedText:${textUrl}`);
            if (cachedText) {
                setText(cachedText);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(textUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const textContent = await response.text();

                // ✅ Cache to localStorage
                localStorage.setItem(`cachedText:${textUrl}`, textContent);
                setText(textContent);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching text:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchText();
    }, [textUrl]);

    if (!textUrl) return null;

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {error && (
                <div className="text-center py-4 text-red-500">
                    <p>Failed to load text content</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            )}

            {text && !loading && (
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-y-auto md:px-8 rounded-lg text-justify">
                    {text}
                </div>
            )}
        </>
    );
}
