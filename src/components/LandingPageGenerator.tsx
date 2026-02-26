import { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutTemplate, Loader2, Download, AlertCircle, Code, Link as LinkIcon, DollarSign, Activity, MessageCircle, TrendingUp, Settings2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ImageUploader from './ImageUploader';

export default function LandingPageGenerator() {
  // Basic Info
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  
  // Pricing & Offers
  const [regularPrice, setRegularPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [currency, setCurrency] = useState('ر.س'); // Default SAR
  const [enableUpsell, setEnableUpsell] = useState(true);
  
  // Marketing & Persuasion
  const [marketingAngle, setMarketingAngle] = useState('problem_solving');
  const [enableUrgency, setEnableUrgency] = useState(true);
  const [referencePage, setReferencePage] = useState('');
  
  // Tracking & Contact
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [tiktokPixel, setTiktokPixel] = useState('');
  const [snapchatPixel, setSnapchatPixel] = useState('');
  const [metaPixel, setMetaPixel] = useState('');

  // App State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [resultHtml, setResultHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (ai: GoogleGenAI, prompt: string, imageBase64: string, mime: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: mime } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: { aspectRatio: '1:1' }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    return null;
  };

  const handleGenerate = async () => {
    if (!productName.trim() || !productDescription.trim() || !promoPrice.trim()) {
      setError('الرجاء إدخال اسم المنتج، الوصف، وسعر العرض على الأقل.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultHtml(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let generatedImages: (string | null)[] = [null, null, null, null];

      if (selectedImage && mimeType) {
        setProgressText('جاري توليد 4 صور احترافية للمنتج (قد يستغرق بعض الوقت)...');
        
        const prompts = [
          `Professional lifestyle product photography of this product, high quality, 4k, well lit, placed in a luxurious setting suitable for the Gulf market.`,
          `Close up lifestyle shot of this product being used or displayed, elegant background, 8k resolution, photorealistic.`,
          `Product photography showing the product in action or held by a hand, natural lighting, highly detailed, cinematic.`,
          `Aesthetically pleasing flatlay or creative composition of this product, premium look, suitable for Instagram ads.`
        ];
        
        generatedImages = await Promise.all(
          prompts.map(p => generateImage(ai, p, selectedImage, mimeType).catch((e) => { console.error(e); return null; }))
        );
      }

      setProgressText('جاري تصميم وكتابة محتوى صفحة الهبوط...');

      const angleDescriptions: Record<string, string> = {
        luxury: 'Focus on luxury, exclusivity, premium quality, and status. Use elegant and sophisticated language.',
        problem_solving: 'Focus heavily on the customer\'s pain points and how this product is the ultimate, easy solution. Use empathetic and reassuring language.',
        discount: 'Focus on the massive discount, clearance, and unbeatable value. Create a sense of a rare, unmissable deal.'
      };

      const prompt = `
You are an expert copywriter, SEO specialist, and web developer specializing in the Gulf (Khaliji) e-commerce market.
Create a high-converting, mobile-first landing page for the following product, optimized for TikTok, Instagram, and Snapchat ads traffic.
The language MUST be Arabic, specifically tailored to the Gulf audience (professional, persuasive, and culturally appropriate).

Product Name: ${productName}
Product Description: ${productDescription}
Regular Price: ${regularPrice ? `${regularPrice} ${currency}` : 'N/A'}
Promo Price: ${promoPrice} ${currency}
Marketing Angle: ${angleDescriptions[marketingAngle]}
${referencePage ? `\nReference Landing Page Style/Structure/URL:\n"""\n${referencePage}\n"""\nCRITICAL: Analyze the structure, tone, and design style of the reference provided above. Mimic its layout and flow as closely as possible, but adapt the content for the new product.` : ''}

Requirements:
1. **Persuasive Copywriting**: Use the AIDA framework. Focus heavily on the selected Marketing Angle. ${regularPrice ? `Highlight the massive discount (from ${regularPrice} to ${promoPrice} ${currency}).` : `Highlight the price of ${promoPrice} ${currency}.`} Use strong emotional triggers and fake reviews/testimonials for social proof.
2. **Unique Design Every Time**: DO NOT use a standard template. Use a completely unique layout, color palette, and typography combination. Make it look like a premium, custom-coded brand page.
3. **Payment Method**: The ONLY payment method is "Cash on Delivery" (الدفع عند الاستلام). Highlight this prominently in the copy, buttons, and CTAs.
4. **Order Form (استمارة الطلب)**: 
   - MUST include a clean, easy-to-use order form directly on the page.
   - Fields required: Full Name (الاسم الكامل), Phone Number (رقم الهاتف), City/Region (المدينة/المنطقة), and Detailed Address (العنوان بالتفصيل).
   - The submit button should say "تأكيد الطلب والدفع عند الاستلام".
   ${enableUpsell ? `- CRITICAL: Above the form fields, add a "Quantity Breaks / Upsell" selector (Radio buttons or clickable cards) offering: 1 piece, 2 pieces (with extra discount), 3 pieces (with massive discount). Calculate the prices logically based on the base promo price of ${promoPrice} ${currency}. Update the total price dynamically using JavaScript when a user selects a quantity.` : ''}
5. **Urgency & Social Proof (FOMO)**:
   ${enableUrgency ? `- Include a JavaScript countdown timer (e.g., "ينتهي العرض بعد 02:15:30").
   - Include a fake "Live Sales Popup" using JavaScript that shows a toast notification every 8-12 seconds (e.g., "محمد من الرياض اشترى هذا المنتج للتو").
   - Include a live visitor counter (e.g., "يشاهد هذا المنتج 45 شخصاً الآن").` : '- Keep it clean without aggressive urgency timers.'}
6. **Tracking Pixels**:
   - Add the following tracking pixels in the <head> (use standard placeholder scripts if exact code isn't known, but include the IDs):
     ${metaPixel ? `Meta Pixel ID: ${metaPixel}` : ''}
     ${tiktokPixel ? `TikTok Pixel ID: ${tiktokPixel}` : ''}
     ${snapchatPixel ? `Snapchat Pixel ID: ${snapchatPixel}` : ''}
   - Add JavaScript to trigger a 'Purchase' or 'CompletePayment' event for the provided pixels when the order form is submitted successfully.
7. **Contact**:
   ${whatsappNumber ? `- Add a floating WhatsApp button fixed to the bottom left or right, linking to https://wa.me/${whatsappNumber.replace(/\D/g,'')}.` : ''}
8. **SEO & Performance**:
   - Include comprehensive meta tags (title, description, viewport).
   - Add \`loading="lazy"\` to all images for fast loading.
9. **Design & Layout**: Use Tailwind CSS via CDN. Ensure RTL layout (dir="rtl"). Include a sticky CTA button at the bottom of the screen for mobile devices that scrolls smoothly to the order form.
${selectedImage ? `10. I have generated 4 lifestyle images for this product. You MUST use the exact strings \`{{GENERATED_IMAGE_1}}\`, \`{{GENERATED_IMAGE_2}}\`, \`{{GENERATED_IMAGE_3}}\`, and \`{{GENERATED_IMAGE_4}}\` as the \`src\` attributes for the product images across the page.` : `10. Include placeholder images (e.g., using https://picsum.photos) generously throughout the page.`}
11. Return ONLY valid HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include markdown formatting like \`\`\`html.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.9,
        }
      });

      let html = response.text || '';
      html = html.replace(/^```html\n?/, '').replace(/\n?```$/, '');

      if (selectedImage) {
        const fallback = `data:${mimeType};base64,${selectedImage}`;
        html = html.replace(/\{\{GENERATED_IMAGE_1\}\}/g, generatedImages[0] || fallback);
        html = html.replace(/\{\{GENERATED_IMAGE_2\}\}/g, generatedImages[1] || fallback);
        html = html.replace(/\{\{GENERATED_IMAGE_3\}\}/g, generatedImages[2] || fallback);
        html = html.replace(/\{\{GENERATED_IMAGE_4\}\}/g, generatedImages[3] || fallback);
      }

      if (html) {
        setResultHtml(html);
      } else {
        setError('فشل في توليد صفحة الهبوط. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'حدث خطأ أثناء التوليد.');
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  const handleDownload = () => {
    if (!resultHtml) return;
    const blob = new Blob([resultHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landing-page-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">إنشاء صفحة هبوط (Landing Page)</h2>
        <p className="text-zinc-500 mt-2">
          قم بإنشاء صفحة هبوط احترافية مصممة خصيصاً للسوق الخليجي بضغطة زر، مع دعم البيكسل وعروض الكميات.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Right Column: Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm overflow-y-auto max-h-[85vh] custom-scrollbar">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b pb-2">
              <LayoutTemplate size={18} className="text-indigo-600" />
              المعلومات الأساسية
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                صورة المنتج (سيتم توليد 4 صور احترافية منها)
              </label>
              <ImageUploader
                selectedImage={selectedImage}
                onImageSelected={(base64, mime) => {
                  setSelectedImage(base64);
                  setMimeType(mime);
                }}
                onClear={() => {
                  setSelectedImage(null);
                  setMimeType('');
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">اسم المنتج *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: عطر العود الفاخر"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">وصف المنتج ومميزاته *</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="صف منتجك، فوائده، ولماذا يجب على العميل شرائه..."
                className="w-full h-24 px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Offers */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b pb-2">
              <DollarSign size={18} className="text-emerald-600" />
              التسعير والعروض
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">السعر قبل الخصم</label>
                <input
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="مثال: 299"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">سعر العرض *</label>
                <input
                  type="number"
                  value={promoPrice}
                  onChange={(e) => setPromoPrice(e.target.value)}
                  placeholder="مثال: 149"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">العملة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
              >
                <option value="ر.س">ريال سعودي (ر.س)</option>
                <option value="د.إ">درهم إماراتي (د.إ)</option>
                <option value="د.ك">دينار كويتي (د.ك)</option>
                <option value="ر.ع">ريال عماني (ر.ع)</option>
                <option value="ر.ق">ريال قطري (ر.ق)</option>
                <option value="د.ب">دينار بحريني (د.ب)</option>
                <option value="درهم">درهم مغربي (درهم)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
              <input
                type="checkbox"
                checked={enableUpsell}
                onChange={(e) => setEnableUpsell(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-zinc-900 text-sm">تفعيل عروض الكميات (Upsells)</p>
                <p className="text-xs text-zinc-500">إضافة خيارات شراء (حبة، حبتين، 3 حبات) لزيادة الأرباح.</p>
              </div>
            </label>
          </div>

          {/* Section 3: Marketing & Persuasion */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b pb-2">
              <TrendingUp size={18} className="text-orange-500" />
              زاوية التسويق والإقناع
            </h3>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">زاوية التسويق (Marketing Angle)</label>
              <select
                value={marketingAngle}
                onChange={(e) => setMarketingAngle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
              >
                <option value="problem_solving">حل مشكلة أو ألم (الأفضل للمنتجات العملية)</option>
                <option value="luxury">الفخامة والرفاهية (الأفضل للعطور والمجوهرات)</option>
                <option value="discount">عرض لا يفوت وتصفية (الأفضل للتخفيضات الكبرى)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
              <input
                type="checkbox"
                checked={enableUrgency}
                onChange={(e) => setEnableUrgency(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500"
              />
              <div>
                <p className="font-medium text-zinc-900 text-sm">تفعيل عناصر الندرة (FOMO)</p>
                <p className="text-xs text-zinc-500">إضافة عداد تنازلي، إشعارات مبيعات حية، وعداد زوار.</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} />
                صفحة مرجعية (اختياري)
              </label>
              <textarea
                value={referencePage}
                onChange={(e) => setReferencePage(e.target.value)}
                placeholder="ضع رابط صفحة هبوط تعجبك ليقوم الذكاء الاصطناعي بتقليد تصميمها..."
                className="w-full h-20 px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow text-sm"
              />
            </div>
          </div>

          {/* Section 4: Tracking & Contact */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 border-b pb-2">
              <Activity size={18} className="text-blue-500" />
              التتبع والتواصل (Pixels)
            </h3>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                <MessageCircle size={16} className="text-green-500" />
                رقم الواتساب (اختياري)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="مثال: 966500000000"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-left"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={tiktokPixel}
                  onChange={(e) => setTiktokPixel(e.target.value)}
                  placeholder="e.g. C123456789"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Snapchat Pixel ID</label>
                <input
                  type="text"
                  value={snapchatPixel}
                  onChange={(e) => setSnapchatPixel(e.target.value)}
                  placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Meta (Facebook) Pixel ID</label>
                <input
                  type="text"
                  value={metaPixel}
                  onChange={(e) => setMetaPixel(e.target.value)}
                  placeholder="e.g. 123456789012345"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start gap-3 mt-4">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="pt-4 sticky bottom-0 bg-white pb-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !productName.trim() || !productDescription.trim() || !promoPrice.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Settings2 size={20} />
                  توليد صفحة الهبوط الاحترافية
                </>
              )}
            </button>
          </div>
        </div>

        {/* Left Column: Result */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-[85vh]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-700">معاينة النتيجة</h3>
            {resultHtml && !isGenerating && (
              <button
                onClick={handleDownload}
                className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm"
              >
                <Download size={16} />
                تحميل الكود (HTML)
              </button>
            )}
          </div>
          
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center text-zinc-400 text-center px-4">
                <Loader2 size={40} className="animate-spin mb-4 text-indigo-500 mx-auto" />
                <p className="font-medium animate-pulse text-zinc-700">{progressText || 'جاري تصميم وكتابة محتوى الصفحة...'}</p>
                <p className="text-sm text-zinc-500 mt-2">نعمل على دمج البيكسل، التسعير، وعناصر الإقناع...</p>
              </div>
            ) : resultHtml ? (
              <iframe
                srcDoc={resultHtml}
                title="Landing Page Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <Code size={48} className="mb-4 opacity-50" />
                <p className="font-medium">ستظهر صفحة الهبوط هنا</p>
                <p className="text-sm mt-2 text-zinc-500 max-w-sm text-center">أدخل معلومات المنتج، الأسعار، وأكواد التتبع للحصول على صفحة جاهزة للإعلانات.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
