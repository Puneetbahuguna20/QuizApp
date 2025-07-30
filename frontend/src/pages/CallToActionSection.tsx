import { Button } from "@/components/ui/button";

 const CallToActionSection = () => (
  <section className="py-20 text-center bg-zinc-900 rounded-xl mx-4 my-10">
    <h2 className="text-3xl font-bold mb-4">Ready to Test Yourself?</h2>
    <p className="text-zinc-400 mb-6">Take a quick quiz and sharpen your skills!</p>
    <Button className="text-lg px-10 py-6 rounded-2xl bg-[#070f29] text-white">
      Start Quiz
    </Button>
  </section>
);
export default CallToActionSection;