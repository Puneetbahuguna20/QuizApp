import { Button } from "@/components/ui/button";

const topics = ["Math", "Science", "History", "Geography", "Coding"];

const QuizTopicsSection = () => (
  <section className="py-16 text-center">
    <h2 className="text-3xl font-bold mb-8">Choose a Topic</h2>
    <div className="flex flex-wrap justify-center gap-4">
      {topics.map((topic, i) => (
        <Button key={i} variant="outline" className="px-6 py-3 rounded-xl">
          {topic}
        </Button>
      ))}
    </div>
  </section>
);
export default QuizTopicsSection;