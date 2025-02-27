
import { Student, Subject, Topic, GeminiAPIResponse, LessonContent, QuizQuestion } from '@/types';

// Function to generate a personalized lesson
export async function generateLesson(
  apiKey: string,
  student: Student,
  subject: Subject,
  topic: Topic
): Promise<GeminiAPIResponse> {
  try {
    // In a real app, we would make a request to the Gemini API
    // For demo purposes, we'll simulate the API response
    
    // This would be the actual API request to Gemini in a full implementation
    // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     contents: [
    //       {
    //         parts: [
    //           {
    //             text: `Create an educational lesson for a ${student.age} year old student in grade ${student.grade} 
    //             about ${topic.name} in ${subject.name}. 
    //             The student is interested in ${student.interests.join(', ')}.
    //             Please include a title, introduction, 3-5 sections with examples, a summary, and related topics.
    //             Format the response as JSON compatible with the LessonContent type.`
    //           }
    //         ]
    //       }
    //     ]
    //   }),
    // });
    
    // // Parse the response
    // const data = await response.json();
    // return data.candidates[0].content.parts[0].text;
    
    // For demo purposes, we'll return a mock response
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    const mockLesson: LessonContent = {
      title: `Understanding ${topic.name}`,
      introduction: `Welcome ${student.name}! Today we're going to learn about ${topic.name} in ${subject.name}. Since you enjoy ${student.interests[0]}, we'll include some connections to that as we explore this fascinating topic.`,
      sections: [
        {
          title: 'The Basics',
          content: `Let's start with the fundamental concepts of ${topic.name}. This is perfect for your grade ${student.grade} level and will build on what you already know.`,
          example: `For example, think about when you're ${student.interests[0]} - you actually use concepts from ${topic.name} without even realizing it!`,
          activity: {
            type: 'question',
            description: `Can you identify how ${topic.name} might appear in your everyday life?`
          }
        },
        {
          title: 'Key Principles',
          content: `Now that we understand the basics, let's explore some key principles of ${topic.name} that are appropriate for your age group.`,
          example: `Imagine you're explaining ${topic.name} to a friend who has never heard of it before. What would you say?`,
          activity: {
            type: 'exercise',
            description: `Try drawing a diagram that shows how ${topic.name} works.`
          }
        },
        {
          title: 'Real-World Applications',
          content: `${topic.name} isn't just a theoretical concept - it has many practical applications in the world around us!`,
          example: `Scientists and engineers use ${topic.name} to solve problems like ${student.interests.includes('science') ? 'developing new technologies' : 'designing video games'}.`,
          activity: {
            type: 'experiment',
            description: `Let's do a simple experiment to demonstrate ${topic.name} in action!`,
            solution: `The result should show that ${topic.name} works exactly as we've discussed.`
          }
        }
      ],
      summary: `Great job exploring ${topic.name} today! We've covered the basics, key principles, and real-world applications. Remember that ${topic.name} connects to many of your interests like ${student.interests.join(', ')}.`,
      relatedTopics: ['Advanced concepts', 'Historical development', 'Future trends']
    };
    
    return { content: mockLesson };
  } catch (error) {
    console.error('Error generating lesson:', error);
    return { 
      content: {} as LessonContent, 
      error: 'Failed to generate lesson. Please check your API key and try again.' 
    };
  }
}

// Function to generate a quiz based on the lesson
export async function generateQuiz(
  apiKey: string,
  student: Student,
  subject: Subject,
  topic: Topic,
  numberOfQuestions: number = 5
): Promise<GeminiAPIResponse> {
  try {
    // Similar to generateLesson, we would make a request to the Gemini API
    // For demo purposes, we'll simulate the API response
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const mockQuestions: QuizQuestion[] = [
      {
        id: '1',
        question: `What is one of the key principles of ${topic.name}?`,
        options: [
          'It only exists in theory',
          'It has many practical applications',
          'It was discovered recently',
          'It is only used by adults'
        ],
        correctAnswer: 1,
        explanation: `${topic.name} has many practical applications in the real world, as we learned in the lesson.`,
        type: 'multiple-choice'
      },
      {
        id: '2',
        question: `True or False: ${topic.name} is connected to ${student.interests[0]}.`,
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: `Yes, ${topic.name} connects to ${student.interests[0]} as we saw in our examples.`,
        type: 'true-false'
      },
      {
        id: '3',
        question: `Name one way you might use ${topic.name} in your everyday life.`,
        correctAnswer: 'Various answers possible',
        explanation: `There are many correct answers here! You might use ${topic.name} when you're ${student.interests.join(' or ')}.`,
        type: 'short-answer'
      },
      {
        id: '4',
        question: `Which of these is NOT a section we covered in our lesson about ${topic.name}?`,
        options: [
          'The Basics',
          'Key Principles',
          'Advanced Mathematics',
          'Real-World Applications'
        ],
        correctAnswer: 2,
        explanation: `We covered The Basics, Key Principles, and Real-World Applications, but not Advanced Mathematics.`,
        type: 'multiple-choice'
      },
      {
        id: '5',
        question: `What grade level is this lesson designed for?`,
        options: [
          `Grade ${student.grade - 1}`,
          `Grade ${student.grade}`,
          `Grade ${student.grade + 1}`,
          `Grade ${student.grade + 2}`
        ],
        correctAnswer: 1,
        explanation: `This lesson was specially designed for your grade level, Grade ${student.grade}.`,
        type: 'multiple-choice'
      }
    ];
    
    return { content: mockQuestions };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { 
      content: [] as QuizQuestion[], 
      error: 'Failed to generate quiz. Please check your API key and try again.' 
    };
  }
}

// Function to validate the API key
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    // In a real app, we would make a simple request to validate the API key
    // For demo purposes, we'll simulate validation
    
    // This would be the actual validation request in a full implementation
    // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    // return response.status === 200;
    
    // Simulate API validation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, accept any non-empty string as valid
    return apiKey.trim().length > 0;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}
