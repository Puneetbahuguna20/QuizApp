import { Card, CardContent, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Fast & Fun",
    desc: "Enjoy instant quiz feedback with no delays.",
  },
  {
    title: "Multiple Topics",
    desc: "Test knowledge across a variety of subjects.",
  },
  {
    title: "Track Progress",
    desc: "See your improvement over time.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-8">Why Use QuickQuiz?</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <Card key={i} className="bg-zinc-900 border border-white/10">
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-2">{f.title}</CardTitle>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
