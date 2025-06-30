import { Form, Input, Button } from "antd";
import { askGemini } from "../../services/gemini.service";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import binglogo from "../../assets/img/png/binglogo.jpg";

const ModelAI = () => {
  const [reply, setReply] = useState("");
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ prompt }) => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await askGemini(prompt);
      if (res.reply) setReply(res.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  const predefinedPrompts = ["View products at store", "Hello", "Return Policy"];

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition"
            onClick={() => setIsOpen(true)}
            title="Chat với AI"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden z-1001">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between">
            <span className="font-semibold">Bingsu AI</span>
            <button onClick={() => setIsOpen(false)} title="Đóng">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-800 whitespace-pre-line">
            {loading ? (
              <p className="italic text-gray-500">Responding...</p>
            ) : reply ? (
              <p>{reply}</p>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img width={40} src={binglogo} alt="AI" className="rounded-full" />
                  <p className="font-bold text-sm">Hi! I'm AI in BingCloth Store</p>
                </div>
                <p className="text-gray-400 italic text-sm">
                  Ask me anything about product...
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {predefinedPrompts.map((text, i) => (
                    <Button
                      key={i}
                      size="small"
                      onClick={() => onFinish({ prompt: text })}
                      disabled={loading}
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3 bg-gray-50">
            <Form
              form={form}
              onFinish={onFinish}
              layout="inline"
              className="gap-2 w-full"
            >
              <Form.Item name="prompt" className="flex-1 m-0">
                <Input placeholder="Ask me?" allowClear disabled={loading} />
              </Form.Item>
              <Button htmlType="submit" type="primary" loading={loading}>
                Send
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelAI;
