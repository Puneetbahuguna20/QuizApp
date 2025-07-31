
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card className="w-full bg-[rgb(10,10,10)] border border-white/10 shadow-2xl rounded-2xl">
        {/* Header inside Card */}
        <div className="flex justify-between items-center px-10 pt-8">
          <h1 className="text-3xl font-bold text-white">QuickQuiz</h1>
          <nav className="space-x-6 text-base">
            <Link to="/login" className="hover:underline text-white">
              Login
            </Link>
            <Link to="/register" className="hover:underline text-white">
              Register
            </Link>
          </nav>
        </div>

        <CardContent className="flex flex-col items-center justify-center text-center py-24 px-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            Test Your Knowledge
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Take fun, fast, and interactive quizzes to challenge yourself across various topics.
          </p>
          <Link to="/Dashboard" className="w-full">
           <Button
  size="lg"
  className="text-lg px-10 py-6 rounded-2xl bg-[#070f29] hover:bg-[#0a1440] text-white"
>
  Start Quiz
</Button>

          </Link>
        </CardContent>
      </Card>


      </div>
    </main>
  );
};

export default Home;
