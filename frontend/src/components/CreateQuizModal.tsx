import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface NewQuizData {
  title: string;
  subject: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
}

interface CreateQuizModalProps {
  onClose: () => void;
  onCreateQuiz: (quizData: NewQuizData) => void;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ onClose, onCreateQuiz }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 30,
    passingScore: 70,
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionId: string, field: string, value: string | number) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.subject || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question.trim()) {
        alert('Please fill in all questions');
        return;
      }
      for (const option of question.options) {
        if (!option.trim()) {
          alert('Please fill in all options for each question');
          return;
        }
      }
    }

    const quizData: NewQuizData = {
      ...formData,
      questions,
    };

    onCreateQuiz(quizData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0c0c] text-white border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Quiz</CardTitle>
          <CardDescription className="text-white/60">
            Fill in the details to create a new quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Quiz Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-white">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Brief description of the quiz"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="bg-white/10 border-white/20 text-white"
                  min="5"
                  max="180"
                />
              </div>
              <div>
                <Label htmlFor="passingScore" className="text-white">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                  className="bg-white/10 border-white/20 text-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  ➕ Add Question
                </Button>
              </div>

              {questions.map((question, questionIndex) => (
                <Card key={question.id} className="bg-[#181f36] border-white/10">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Question {questionIndex + 1}</h4>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label className="text-white">Question Text *</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white">Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => handleQuestionChange(question.id, 'correctAnswer', optionIndex)}
                              className="text-blue-600"
                            />
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800"
              >
                Create Quiz
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuizModal; 