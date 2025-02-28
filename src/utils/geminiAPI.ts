
import { Student, Subject, Topic, GeminiAPIResponse, LessonContent, QuizQuestion } from '@/types';

// Function to generate a personalized lesson
export async function generateLesson(
  apiKey: string,
  student: Student,
  subject: Subject,
  topic: Topic
): Promise<GeminiAPIResponse> {
  try {
    console.log('Generating lesson with:', { 
      apiKey: apiKey ? 'API Key provided' : 'No API Key', 
      student, 
      subject, 
      topic 
    });

    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Updated to use gemini-1.5-pro model instead of gemini-pro
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create an educational lesson for a ${student.age} year old student in grade ${student.grade} 
                about ${topic.name} in ${subject.name}. 
                The student is interested in ${student.interests.join(', ')}.
                Please include a title, introduction, 3-5 sections with examples, a summary, and related topics.
                Format the response in the following JSON structure:
                {
                  "title": "Lesson Title",
                  "introduction": "Engaging introduction text...",
                  "sections": [
                    {
                      "title": "Section Title",
                      "content": "Main content text...",
                      "example": "Example illustrating the concept...",
                      "activity": {
                        "type": "question|exercise|experiment",
                        "description": "Activity description...",
                        "solution": "Optional solution..."
                      }
                    }
                  ],
                  "summary": "Lesson summary text...",
                  "relatedTopics": ["Topic 1", "Topic 2", "Topic 3"]
                }`
              }
            ]
          }
        ]
      }),
    });
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    if (data.error) {
      console.error('API returned error:', data.error);
      throw new Error(data.error.message || 'Error generating lesson');
    }
    
    // Extract the text from the response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error('No text content in response:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    try {
      // Find the JSON object in the text response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : null;
      
      if (!jsonContent) {
        console.error('Could not find JSON in text:', textContent);
        throw new Error('Could not find JSON content in the response');
      }
      
      // Parse the JSON content
      const lessonContent = JSON.parse(jsonContent) as LessonContent;
      console.log('Successfully parsed lesson content:', lessonContent);
      return { content: lessonContent };
    } catch (parseError) {
      console.error('Error parsing lesson JSON:', parseError);
      console.log('Raw text content:', textContent);
      
      // Fallback to a structured format if parsing fails
      const fallbackLesson: LessonContent = {
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
      
      console.log('Using fallback lesson content:', fallbackLesson);
      return { content: fallbackLesson };
    }
  } catch (error) {
    console.error('Error generating lesson:', error);
    return { 
      content: {} as LessonContent, 
      error: error instanceof Error ? error.message : 'Failed to generate lesson. Please check your API key and try again.' 
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
    console.log('Generating quiz with:', { 
      apiKey: apiKey ? 'API Key provided' : 'No API Key', 
      student, 
      subject, 
      topic 
    });

    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Updated to use gemini-1.5-pro model instead of gemini-pro
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create a quiz with ${numberOfQuestions} questions about ${topic.name} in ${subject.name} for a ${student.age} year old student in grade ${student.grade}.
                Include multiple-choice, true-false, and short-answer questions.
                Format the response as a JSON array with this structure:
                [
                  {
                    "id": "1",
                    "question": "Question text",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": 0,
                    "explanation": "Explanation of the correct answer",
                    "type": "multiple-choice"
                  },
                  {
                    "id": "2",
                    "question": "True/False question text",
                    "options": ["True", "False"],
                    "correctAnswer": "True",
                    "explanation": "Explanation of why this is true or false",
                    "type": "true-false"
                  },
                  {
                    "id": "3",
                    "question": "Short answer question text",
                    "correctAnswer": "Expected answer or answers",
                    "explanation": "Explanation of the correct answer",
                    "type": "short-answer"
                  }
                ]`
              }
            ]
          }
        ]
      }),
    });
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Gemini API Response for quiz:', data);
    
    if (data.error) {
      console.error('API returned error:', data.error);
      throw new Error(data.error.message || 'Error generating quiz');
    }
    
    // Extract the text from the response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error('No text content in quiz response:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    try {
      // Find the JSON array in the text response
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      const jsonContent = jsonMatch ? jsonMatch[0] : null;
      
      if (!jsonContent) {
        console.error('Could not find JSON array in text:', textContent);
        throw new Error('Could not find JSON content in the response');
      }
      
      // Parse the JSON content
      const quizQuestions = JSON.parse(jsonContent) as QuizQuestion[];
      console.log('Successfully parsed quiz questions:', quizQuestions);
      return { content: quizQuestions };
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      console.log('Raw text content:', textContent);
      
      // Fallback to a structured format if parsing fails
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
      
      console.log('Using fallback quiz questions:', mockQuestions);
      return { content: mockQuestions };
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { 
      content: [] as QuizQuestion[], 
      error: error instanceof Error ? error.message : 'Failed to generate quiz. Please check your API key and try again.' 
    };
  }
}

// Function to validate the API key
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    console.log('Validating API key');

    if (!apiKey) {
      console.error('No API key provided');
      return false;
    }

    // Make a simple request to the Gemini API to check if the key is valid
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      console.error('API key validation failed:', response.status, response.statusText);
      return false;
    }

    console.log('API key validation successful');
    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}
