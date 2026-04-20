import { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  MessageCircle, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  Send, 
  Lock, 
  EyeOff, 
  UserPlus, 
  Info,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSafetyGuidance } from './services/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'assistant' | 'tools' | 'legal'>('home');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Namaste, main Nirmal Sahayak hoon. Main yahan aapki suraksha aur madad ke liye hoon. Agar aap kisi blackmail ya harassment ka samna kar rahe hain, toh mujhse share karein. Main aapko sahi rasta dikhane me madad karunga.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await getSafetyGuidance(chatInput, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-rose-500 p-2 rounded-xl">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
              Nirmal Suraksha
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => setActiveTab('home')}
              className={`hover:text-rose-500 transition-colors ${activeTab === 'home' ? 'text-rose-600' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('assistant')}
              className={`hover:text-rose-500 transition-colors ${activeTab === 'assistant' ? 'text-rose-600' : ''}`}
            >
              AI Assistant
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`hover:text-rose-500 transition-colors ${activeTab === 'tools' ? 'text-rose-600' : ''}`}
            >
              Reporting Tools
            </button>
            <button 
              onClick={() => setActiveTab('legal')}
              className={`hover:text-rose-500 transition-colors ${activeTab === 'legal' ? 'text-rose-600' : ''}`}
            >
              Legal Rights
            </button>
          </div>

          <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Lock className="w-3 h-3" /> Secure Access
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto px-4"
            >
              {/* Hero Section */}
              <div className="relative mb-16">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
                
                <div className="relative text-center max-w-3xl mx-auto py-12">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold mb-6"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Aap Akeli Nahi Hain
                  </motion.div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
                    Aapki Ijjat Aur <span className="text-rose-600">Suraksha</span> Hamari Pehal.
                  </h1>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    Nirmal Suraksha ek surakshit platform hai jo online harassment aur blackmail ke khilaf ladne me aapki madad karta hai. Bina kisi darr ke report karein aur apna haq pehchanein.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={() => setActiveTab('assistant')}
                      className="w-full sm:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                    >
                      AI Sahayak Se Baat Karein <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                    <a 
                      href="https://www.cybercrime.gov.in/"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Anonymous Report Karein <Shield className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Priority Actions */}
              <div className="grid md:grid-cols-3 gap-6 mb-20">
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-rose-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <EyeOff className="text-rose-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Stop NCII</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Agar apki private images social media par leak hone ka darr hai, toh StopNCII ka upyog karein. Yeh globally sabhi platforms (Meta, TikTok etc) ke sath kaam karta hai.
                  </p>
                  <a 
                    href="https://stopncii.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-rose-600 text-sm font-bold flex items-center gap-1 group"
                  >
                    Go to StopNCII <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <UserPlus className="text-indigo-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Minors (Under 18)</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    NCMEC ka 'Take It Down' tool un bachhon ke liye hai jinki objectionable photos kisi ne share ki ho. Yeh automatic remove karne me madad karta hai.
                  </p>
                  <a 
                    href="https://takeitdown.ncmec.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-indigo-600 text-sm font-bold flex items-center gap-1 group"
                  >
                    Take It Down <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="text-amber-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Cybercrime India</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Aap apni complaint bina thae jaye online darz kar sakte hain. Aapki identity ko hidden rakha jata hai koshish ki jati hai taaki aap safe rahein.
                  </p>
                  <a 
                    href="https://www.cybercrime.gov.in/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-amber-600 text-sm font-bold flex items-center gap-1 group"
                  >
                    Report Online <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Steps Section */}
              <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
                <div className="relative grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Agar aap Blackmail ho rahi hain toh kya karein?</h2>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                          <p className="font-bold mb-1">Ghabrayen Nahi</p>
                          <p className="text-slate-400 text-sm">Blackmailer aapke darne ka fayda uthata hai. Pehle shant ho jayein.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                          <p className="font-bold mb-1">Paisa Mat De</p>
                          <p className="text-slate-400 text-sm">Paisa dene se blackmailing rukti nahi hai, aur zyada paise mange jate hain.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                          <p className="font-bold mb-1">Saboot Ikatha Karein</p>
                          <p className="text-slate-400 text-sm">Chat ka screenshot lein, profile ka link save karein.</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-sm">4</div>
                        <div>
                          <p className="font-bold mb-1">Official Reporting</p>
                          <p className="text-slate-400 text-sm">StopNCII.org ya cybercrime portal par turant report karein.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-3xl p-8 border border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img 
                          src="https://picsum.photos/seed/nurse/200/200" 
                          alt="AI Sahayak" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="font-bold italic">Nirmal Sahayak</p>
                        <p className="text-xs text-slate-400">AI Safety Assistant</p>
                      </div>
                    </div>
                    <p className="text-lg italic text-slate-300 leading-relaxed">
                      "Aapki privacy aapka haq hai. Humein batayein kya hua, hum step-by-step aapko guide karenge bina kisi judge kiye."
                    </p>
                    <button 
                      onClick={() => setActiveTab('assistant')}
                      className="mt-8 bg-white text-slate-900 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                    >
                      Chat Start Karein <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'assistant' && (
            <motion.div 
              key="assistant"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto px-4 h-[calc(100vh-9rem)] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-rose-500 p-2 rounded-xl">
                  <MessageCircle className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Nirmal Sahayak</h2>
                  <p className="text-xs text-slate-500">24/7 AI Safety Support</p>
                </div>
              </div>

              <div className="flex-1 bg-white border border-slate-100 rounded-[2rem] p-6 mb-4 overflow-y-auto shadow-sm">
                <div className="space-y-6">
                  {messages.map((m) => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-3xl ${
                        m.role === 'user' 
                          ? 'bg-rose-600 text-white rounded-tr-none shadow-md shadow-rose-100' 
                          : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        <p className={`text-[10px] mt-2 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 p-4 rounded-3xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="relative group">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Yahan apni baat batayein..."
                  className="w-full bg-white border border-slate-200 rounded-full py-4 px-6 pr-14 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50/50 transition-all shadow-sm group-hover:shadow-md"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isLoading}
                  className="absolute right-2 top-2 p-3 bg-slate-900 text-white rounded-full hover:bg-rose-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-4 px-8">
                Nirmal Sahayak ek AI hai. Yadi aapko emergency hai toh kripya local police (112) ya Cybercrime helpline (1930) par call karein.
              </p>
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div 
              key="tools"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-6xl mx-auto px-4"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight">Official Reporting Tools</h2>
                <p className="text-slate-600">Yeh wahi tools hain jo platforms (Facebook, Instagram, LinkedIn, etc) direct content remove karne ke liye use karte hain.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-start shadow-sm">
                  <div className="bg-rose-500/10 p-4 rounded-2xl mb-8">
                    <Shield className="text-rose-600 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">StopNCII.org</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Agar apki intimate image leak ho gayi hai ya koi dhamki de raha hai, toh yeh portal us image ka 'HASH' (digital footprint) banata hai. Fir Meta, Twitter, TikTok, Snapchat jese platforms bina wahi image dekhe usko remove ya block kar dete hain.
                  </p>
                  <ul className="space-y-3 mb-10 w-full font-medium text-slate-700">
                    <li className="flex items-center gap-3"><Lock className="w-4 h-4 text-emerald-500" /> Full Privacy Focused</li>
                    <li className="flex items-center gap-3"><EyeOff className="w-4 h-4 text-emerald-500" /> No one sees the original image</li>
                    <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-emerald-500" /> Works with global platforms</li>
                  </ul>
                  <a 
                    href="https://stopncii.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors"
                  >
                    Go to StopNCII <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-start shadow-sm">
                  <div className="bg-indigo-500/10 p-4 rounded-2xl mb-8">
                    <LifeBuoy className="text-indigo-600 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Take It Down</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    National Center for Missing & Exploited Children (NCMEC) dwara banaya gaya yeh tool vishesh roop se bachhon aur teenagers (under 18) ke liye hai. Yeh sexual content ko remove karne me 99% tak asardar hai.
                  </p>
                  <ul className="space-y-3 mb-10 w-full font-medium text-slate-700">
                    <li className="flex items-center gap-3"><Lock className="w-4 h-4 text-emerald-500" /> Secure Hash generation</li>
                    <li className="flex items-center gap-3"><Info className="w-4 h-4 text-emerald-500" /> Educational resources for parents</li>
                    <li className="flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-emerald-500" /> Emergency escalation for minors</li>
                  </ul>
                  <a 
                    href="https://takeitdown.ncmec.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-auto w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors"
                  >
                    Use Take It Down <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="mt-12 bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-rose-900 mb-2">Technical Disclaimer</h4>
                  <p className="text-rose-800/80 text-sm leading-relaxed">
                    Koi bhi website "bina permission" ke kisi dusre platform se content remove nahi kar sakti. Lekin StopNCII aur NCMEC woh official raste hain jo in platforms ne banaye hain taaki ladkiyo ki privacy surakshit rahe. Nirmal Sahayak aapko inhi rasto se sahi tareeke se guzarna sikhata hai.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-rose-200 text-rose-900 font-bold text-sm text-center">
                  Always Trust Official Links
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'legal' && (
            <motion.div 
              key="legal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="max-w-4xl mx-auto px-4"
            >
              <h2 className="text-4xl font-bold mb-8 tracking-tight text-center">Aapke Kanooni Adhikaar</h2>
              
              <div className="space-y-6 mb-12">
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-indigo-600 w-5 h-5" /> Section 66E (IT Act)
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Bina kisi ki marzi ke unki private moments ko share karna, record karna ya capture karna ek jurm hai. Isme 3 saal tak ki saza aur ₹2 lakh ka jurmana ho sakta hai.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-indigo-600 w-5 h-5" /> Section 67 & 67A
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Objectionable content (sexually explicit) online publish karna ya transfer karna kadi saza ka haqdar hai.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-indigo-600 w-5 h-5" /> Anonymous Reporting Adhikaar
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Bharat Sarkar ke Cybercrime.gov.in portal par aap "Report Anonymously" select kar sakti hain. Aapki privacy police maintain karti hai.
                  </p>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-8">
                <div className="bg-white/20 p-4 rounded-2xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Emergency Help-line (India)</h4>
                  <p className="text-indigo-100 mb-6">Agar khatra zyada hai toh turant in numbers par call karein:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xl">1930</div>
                    <div className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xl">112</div>
                    <div className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center">Cybercrime Helpine</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-slate-200 p-1.5 rounded-lg">
              <Shield className="text-slate-600 w-4 h-4" />
            </div>
            <span className="font-bold text-slate-400">Nirmal Suraksha</span>
          </div>
          <div className="text-slate-400 text-xs text-center md:text-right">
            <p className="mb-1">© 2026 Nirmal Suraksha. Developed by <span className="text-slate-600 font-semibold">Shambhu Singh</span>.</p>
            <p>Dedicated to online dignity and safety. Empowered by Community & Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
