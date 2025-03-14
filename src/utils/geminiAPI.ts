import { Student, Subject, Topic, GeminiAPIResponse, LessonContent, QuizQuestion, ApiProvider } from '@/types';

const generatePrompt = (student: Student, subject: Subject, topic: Topic) => {
  return `Create a comprehensive educational lesson for a ${student.age} year old student in grade ${student.grade} 
  about ${topic.name} in ${subject.name}. 
  The student is interested in ${student.interests.join(', ')}.
  
  IMPORTANT: Make this lesson exactly like a Khan Academy lesson. Focus on clear explanations with visual examples and step-by-step learning.
  
  Please create a detailed lesson with:
  1. A captivating title that clearly states the learning objective
  2. A brief introduction explaining why this topic matters and how it connects to real life
  3. 4-6 detailed sections that break down concepts progressively from simple to complex
  4. Each section should have:
     - Clear explanations using simple language appropriate for grade ${student.grade}
     - Step-by-step worked examples (like Khan Academy's step-by-step approach)
     - Visual representations described clearly
     - Common misconceptions and how to avoid them
  5. Interactive practice problems after each section with detailed solutions
  6. Real-world applications that connect to the student's interests: ${student.interests.join(', ')}
  7. A concise summary that reinforces key points
  8. 1-2 printable worksheets with varied difficulty levels (make these very educational)
  9. Specific suggestions for educational images that would enhance learning (with detailed descriptions)
  
  Format the response in the following JSON structure:
  {
    "title": "Clear, specific title focusing on the learning objective",
    "introduction": "Engaging introduction that explains why this topic matters and connects to student interests...",
    "sections": [
      {
        "title": "Clear concept-focused section title",
        "content": "Clear, conversational explanation using simple language with step-by-step breakdowns...",
        "example": "Detailed worked example showing the process step-by-step, exactly as Khan Academy would present it...",
        "activity": {
          "type": "question|exercise|experiment",
          "description": "Interactive practice problem with clear instructions...",
          "solution": "Step-by-step solution showing each calculation or reasoning step..."
        }
      }
    ],
    "summary": "Concise summary reinforcing key points learned...",
    "relatedTopics": ["Related Topic 1", "Related Topic 2", "Related Topic 3"],
    "worksheets": [
      {
        "title": "Practice Worksheet: [Specific Concept]",
        "description": "Clear description of skills being practiced",
        "problems": [
          {
            "question": "Clear, specific problem statement",
            "answer": "Complete step-by-step solution",
            "difficulty": "easy|medium|hard"
          }
        ]
      }
    ],
    "images": [
      {
        "description": "Detailed description of an educational image that would be helpful for this specific concept",
        "alt": "Alternative text describing the image content"
      }
    ]
  }`;
};

const generateQuizPrompt = (student: Student, subject: Subject, topic: Topic, numberOfQuestions: number = 5) => {
  return `Create a comprehensive Khan Academy-style quiz with ${numberOfQuestions} questions about ${topic.name} in ${subject.name} for a ${student.age} year old student in grade ${student.grade}.
  
  IMPORTANT: This quiz should exactly match Khan Academy's style of progressive assessment with clear feedback.
  
  Include:
  - Multiple-choice questions with plausible distractors (wrong answers should represent common misconceptions)
  - True-false questions that check conceptual understanding
  - Short-answer questions that test deeper application
  - Questions that progressively increase in difficulty
  - Questions that test both basic recall and deeper understanding/application
  - Detailed explanations for EACH answer choice (why correct answers are correct and why incorrect answers are incorrect)
  
  Format the response as a JSON array with this structure:
  [
    {
      "id": "1",
      "question": "Clear, focused question testing a specific concept...",
      "options": ["Option A (common misconception)", "Option B (correct answer)", "Option C (common mistake)", "Option D (plausible alternative)"],
      "correctAnswer": 1,
      "explanation": "Detailed explanation of why option B is correct AND why each other option is incorrect...",
      "type": "multiple-choice"
    },
    {
      "id": "2",
      "question": "True/False question requiring conceptual understanding...",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Detailed explanation of the concept, referencing specific parts of the lesson...",
      "type": "true-false"
    },
    {
      "id": "3",
      "question": "Short answer question requiring application of knowledge...",
      "correctAnswer": "Expected answer or answers with variations",
      "explanation": "Step-by-step explanation of how to arrive at this answer, including any formulas or thinking processes...",
      "type": "short-answer"
    }
  ]`;
};

// Function to generate a personalized lesson
export async function generateLesson(
  apiKey: string,
  student: Student,
  subject: Subject,
  topic: Topic,
  provider: ApiProvider = 'gemini'
): Promise<GeminiAPIResponse> {
  try {
    console.log('Generating lesson with:', { 
      apiKey: apiKey ? 'API Key provided' : 'No API Key', 
      student, 
      subject, 
      topic,
      provider
    });

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const prompt = generatePrompt(student, subject, topic);
    let response;

    if (provider === 'gemini') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }),
      });
    } else if (provider === 'deepseek') {
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an educational AI that creates detailed, grade-appropriate lessons.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        }),
      });
    } else {
      throw new Error('Unsupported provider');
    }
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.error) {
      console.error('API returned error:', data.error);
      throw new Error(data.error.message || 'Error generating lesson');
    }
    
    // Extract the text from the response based on provider
    let textContent;
    if (provider === 'gemini') {
      textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else if (provider === 'deepseek') {
      textContent = data.choices?.[0]?.message?.content;
    }
    
    if (!textContent) {
      console.error('No text content in response:', data);
      throw new Error('Invalid response format from API');
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
      
      // If we have image suggestions but no URLs, try to find appropriate images
      if (lessonContent.images && lessonContent.images.length > 0) {
        lessonContent.images = lessonContent.images.map(image => {
          // Add placeholder image URLs based on the subject
          if (!image.url) {
            if (subject.id === 'math') {
              image.url = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000';
            } else if (subject.id === 'science') {
              image.url = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000';
            } else if (subject.id === 'history') {
              image.url = 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=1000';
            } else if (subject.id === 'english') {
              image.url = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1000';
            } else {
              image.url = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000';
            }
          }
          return image;
        });
      }
      
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
        relatedTopics: ['Advanced concepts', 'Historical development', 'Future trends'],
        worksheets: [
          {
            title: `${topic.name} Practice Worksheet`,
            description: `A worksheet to help you practice what you've learned about ${topic.name}`,
            problems: [
              {
                question: `Explain the most important concept related to ${topic.name} in your own words.`,
                difficulty: 'medium'
              },
              {
                question: `How does ${topic.name} relate to ${student.interests[0]}?`,
                difficulty: 'easy'
              },
              {
                question: `What would happen if we applied ${topic.name} to solve a real-world problem?`,
                difficulty: 'hard'
              }
            ]
          }
        ],
        images: [
          {
            description: `Diagram illustrating the key concepts of ${topic.name}`,
            url: subject.id === 'math' 
              ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000' 
              : 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000',
            alt: `Visual representation of ${topic.name}`
          }
        ]
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
  numberOfQuestions: number = 5,
  provider: ApiProvider = 'gemini'
): Promise<GeminiAPIResponse> {
  try {
    console.log('Generating quiz with:', { 
      apiKey: apiKey ? 'API Key provided' : 'No API Key', 
      student, 
      subject, 
      topic,
      provider
    });

    if (!apiKey) {
      throw new Error('API key is required');
    }

    const prompt = generateQuizPrompt(student, subject, topic, numberOfQuestions);
    let response;

    if (provider === 'gemini') {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }),
      });
    } else if (provider === 'deepseek') {
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an educational AI that creates detailed quizzes.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        }),
      });
    } else {
      throw new Error('Unsupported provider');
    }
    
    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response for quiz:', data);
    
    if (data.error) {
      console.error('API returned error:', data.error);
      throw new Error(data.error.message || 'Error generating quiz');
    }
    
    // Extract the text from the response based on provider
    let textContent;
    if (provider === 'gemini') {
      textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else if (provider === 'deepseek') {
      textContent = data.choices?.[0]?.message?.content;
    }
    
    if (!textContent) {
      console.error('No text content in quiz response:', data);
      throw new Error('Invalid response format from API');
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
export async function validateApiKey(apiKey: string, provider: ApiProvider = 'gemini'): Promise<boolean> {
  try {
    console.log(`Validating ${provider} API key`);

    if (!apiKey) {
      console.error('No API key provided');
      return false;
    }

    let response;

    if (provider === 'gemini') {
      // Make a simple request to the Gemini API to check if the key is valid
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    } else if (provider === 'deepseek') {
      // Make a simple request to the DeepSeek API to check if the key is valid
      response = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
    } else {
      console.error('Unsupported provider');
      return false;
    }
    
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
