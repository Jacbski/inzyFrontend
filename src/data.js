export const mockProjects = Array(20).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Project ${i + 1}`,
    description: 'This is a sample project description. It can contain details about the project, its goals, and its current status.',
    thumbnail: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
    trends: Math.floor(Math.random() * 100) + 1,
    date: '2024-10-22',
    requiredItems: [
        'Arduino Uno',
        'Speaker',
        'Microphone',
        'Breadboard',
        'Jumper wires'
    ],
    files: [
        { name: `File${i + 1}.pdf` },
        { name: `Documentation${i + 1}.docx` }
    ],
    steps: [
        {
            image: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
            description: `This is the description for step 1 of Project ${i + 1}`
        },
        {
            image: `/src/assets/dekler-ph-OSk8nBHR21Q-unsplash.jpg`,
            description: `This is the description for step 2 of Project ${i + 1}`
        }
    ],
    comments: [
        {
            author: 'John Doe',
            text: `Great project! I learned a lot from Project ${i + 1}.`,
            date: '2024-10-21'
        },
        {
            author: 'Jane Smith',
            text: `I'm having trouble with step 2 on Project ${i + 1}. Any advice?`,
            date: '2024-10-20'
        },
        ],
    codeBlocks: [
        {
            title: 'Arduino Sketch',
            code: `
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}
        `.trim()
        },
        {
            title: 'Advanced Blink',
            code: `
const int ledPin = 13;
int blinkInterval = 1000;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(blinkInterval);
  digitalWrite(ledPin, LOW);
  delay(blinkInterval);

  if (Serial.available() > 0) {
    blinkInterval = Serial.parseInt();
    Serial.print("New blink interval: ");
    Serial.println(blinkInterval);
  }
}
        `.trim()
        }
    ],
    link: 'https://www.buymeacoffee.com/abdenasser'
}));