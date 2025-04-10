export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  subjectId: number;
  text: string;
  options: Option[];
}

export interface KTTQuestion {
  question: string;
  answers: {
    answer: string;
    isCorrect: boolean;
  }[];
}
