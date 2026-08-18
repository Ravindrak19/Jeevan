export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'Speech' | 'Occupational' | 'Behavioral' | 'Education' | 'Specialized';
  iconName: string;
  ageGroup: string;
  duration: string;
  keyBenefits: string[];
  approach: string;
  faqList: { question: string; answer: string }[];
  whatsappMessage: string;
}

export interface Condition {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  commonSymptoms: string[];
  redFlags: string[];
  recommendedTherapyIds: string[];
  ageOfOnset: string;
  parentTips: string[];
  imageUrl?: string;
}

export interface Therapist {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears: number;
  specialties: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  availabilityDays: string[];
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  seoMetaTitle: string;
  seoMetaDescription: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Sensory Gym' | 'Speech Labs' | 'Play Rooms' | 'Events & Workshops' | 'Infrastructure';
  imageUrl: string;
  altText: string;
  description: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  date: string;
  bookingDate?: string;
  preferredDate?: string;
  timeSlot: string;
  parentName: string;
  phone: string;
  childName: string;
  childAge: string;
  notes: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  leadScore?: 'Hot' | 'Warm' | 'Cold';
  scoreReasoning?: string;
}

export interface Lead {
  id: string;
  parentName: string;
  phone: string;
  email?: string;
  childName?: string;
  childAge: string;
  primaryConcern: string;
  source: string;
  status: 'New Inquiry' | 'Assessment Scheduled' | 'Enrolled' | 'Closed';
  createdAt: string;
  score: 'Hot' | 'Warm' | 'Cold';
  notes: string;
}

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'speech-language-therapy',
    slug: 'speech-language-therapy',
    title: 'Pediatric Speech & Language Therapy',
    shortDesc: 'Comprehensive assessment and intervention for delayed speech, articulation, stuttering, and voice disorders.',
    fullDesc: 'Our Speech & Language Therapy program utilizes evidence-based clinical techniques to help children express themselves clearly, understand complex instructions, and build confidence in communication. We treat speech delays, phonological disorders, stuttering/stammering, and expressive/receptive language impairments using fun, play-based modules.',
    category: 'Speech',
    iconName: 'Mic',
    ageGroup: '1.5 - 16 Years',
    duration: '45 Mins / Session',
    keyBenefits: [
      'Clarity in sound pronunciation & articulation',
      'Vocabulary expansion & sentence formation',
      'Fluency management for stammering/stuttering',
      'Enhanced social communication & conversational turn-taking'
    ],
    approach: 'Interactive clinical play, mirror therapy, oral-motor tools, picture exchange systems (PECS), and parental home plan integration.',
    faqList: [
      {
        question: 'At what age should I consult a speech therapist?',
        answer: 'If your child has fewer than 10-15 words by 18 months or is not speaking 2-word phrases by age 2, we strongly recommend an early speech evaluation.'
      },
      {
        question: 'How long does speech therapy take to show progress?',
        answer: 'Noticeable improvements are usually observed within 8 to 12 weeks of consistent sessions combined with guided home exercises.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I would like to inquire about Pediatric Speech & Language Therapy for my child.'
  },
  {
    id: 'occupational-therapy-sensory',
    slug: 'occupational-therapy-sensory',
    title: 'Occupational Therapy & Sensory Integration',
    shortDesc: 'Specialized therapy in state-of-the-art sensory gyms for motor skills, balance, spatial awareness, and sensory regulation.',
    fullDesc: 'Our Occupational Therapy (OT) unit features a custom-built sensory integration gym equipped with suspended swings, rock walls, tactile tunnels, and ball pits. We assist children struggling with fine motor skills (writing, buttoning), gross motor coordination, body awareness, and sensory hyper/hypo sensitivity.',
    category: 'Occupational',
    iconName: 'Activity',
    ageGroup: '2 - 14 Years',
    duration: '60 Mins / Session',
    keyBenefits: [
      'Improved sensory processing & emotional self-regulation',
      'Pencil grip, handwriting, and fine motor precision',
      'Balance, posture, and spatial orientation',
      'Reduced sensory meltdowns and over-stimulation'
    ],
    approach: 'Sensory diet customization, vestibulo-proprioceptive swing activities, motor planning challenges, and bilateral coordination drills.',
    faqList: [
      {
        question: 'What is a Sensory Integration Gym?',
        answer: 'It is a specialized clinical room with tactile, vestibular, and proprioceptive equipment designed to re-train how the brain receives and interprets sensory signals.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I want to book a Sensory Gym & Occupational Therapy consultation.'
  },
  {
    id: 'autism-early-intervention',
    slug: 'autism-early-intervention',
    title: 'Autism & Early Intervention Center',
    shortDesc: 'Holistic multi-disciplinary intervention for ASD focusing on social engagement, speech, joint attention, and adaptive behavior.',
    fullDesc: 'Early diagnosis and structured intervention before age 5 can fundamentally transform a child’s developmental trajectory. Our Autism Intervention program combines Speech Therapy, Occupational Therapy, and Applied Behavior Analysis (ABA) principles in a warm, nurturing environment.',
    category: 'Specialized',
    iconName: 'HeartHandshake',
    ageGroup: '1 - 8 Years',
    duration: '1.5 - 3 Hours / Day',
    keyBenefits: [
      'Development of eye contact & joint attention',
      'Alternative communication pathways (AAC / PECS)',
      'Reduction in repetitive or self-injurious behaviors',
      'Smooth transition to mainstream school readiness'
    ],
    approach: 'DTT (Discrete Trial Teaching), PRT (Pivotal Response Treatment), ESDM (Early Start Denver Model) tailored to individual developmental profile.',
    faqList: [
      {
        question: 'Why is early intervention so crucial for Autism?',
        answer: 'The neuroplasticity of a child’s brain is highest under age 5. Early structured stimulation creates new neural pathways for communication and learning.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I need details about your Early Intervention & Autism program.'
  },
  {
    id: 'behavioral-therapy-aba',
    slug: 'behavioral-therapy-aba',
    title: 'Behavioral Therapy & ABA Support',
    shortDesc: 'Evidence-based behavioral modification to reduce aggressive outbursts, improve focus, and teach essential life skills.',
    fullDesc: 'We help children with ADHD, oppositional defiance, or emotional dysregulation develop functional coping mechanisms, self-control, and positive habit patterns through positive reinforcement and antecedent strategies.',
    category: 'Behavioral',
    iconName: 'Brain',
    ageGroup: '2 - 16 Years',
    duration: '45 Mins / Session',
    keyBenefits: [
      'Decreased frequency of temper tantrums & aggressive behavior',
      'Sustained attention span and task completion',
      'Enhanced frustration tolerance & emotional resilience',
      'Structured home behavior management routine for parents'
    ],
    approach: 'Functional Behavior Assessment (FBA), token economy systems, replacement behavior training, and parent empowerment coaching.',
    faqList: [
      {
        question: 'Will behavioral therapy punish my child?',
        answer: 'Never. Our clinical methodology relies strictly on Positive Reinforcement and proactive environmental modifications.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I would like to book a Behavioral Therapy consultation.'
  },
  {
    id: 'special-education-remedial',
    slug: 'special-education-remedial',
    title: 'Special Education & Dyslexia Remediation',
    shortDesc: 'Customized learning programs for children with Dyslexia, Dyscalculia, ADHD, and general academic learning difficulties.',
    fullDesc: 'Designed by certified Special Educators, this program bridges academic gaps through multi-sensory reading (Orton-Gillingham approach), memory retention strategies, concept visualizers, and individualized education plans (IEPs).',
    category: 'Education',
    iconName: 'BookOpen',
    ageGroup: '2.5 - 16 Years',
    duration: '50 Mins / Session',
    keyBenefits: [
      'Phonics, decoding, and fluent reading skills',
      'Spelling accuracy and handwriting legibility',
      'Math reasoning and numerical conceptualization',
      'School accommodation and concession guidance (CBSE/ICSE)'
    ],
    approach: 'Multi-sensory learning techniques, visual schema mapping, tactile alphabetic trays, and cognitive memory exercises.',
    faqList: [
      {
        question: 'Do you provide reports for school concessions?',
        answer: 'Yes, our psycho-educational evaluations and progress reports are recognized by CBSE/ICSE boards for scribe/extra-time concessions.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I want to consult regarding Special Education & Dyslexia support.'
  },
  {
    id: 'oral-motor-feeding-therapy',
    slug: 'oral-motor-feeding-therapy',
    title: 'Oral Motor & Feeding Therapy',
    shortDesc: 'Therapy for picky eaters, chewing difficulties, drooling, and muscle weakness in lip/tongue/jaw.',
    fullDesc: 'Specialized interventions for infants and children who struggle with chewing solid foods, frequent choking, severe picky eating, texture aversion, or excessive drooling due to low oral muscle tone.',
    category: 'Specialized',
    iconName: 'Utensils',
    ageGroup: '6 Months - 10 Years',
    duration: '45 Mins / Session',
    keyBenefits: [
      'Strengthening tongue, jaw, and lip musculature',
      'Desensitization to new food textures and smells',
      'Control over excessive saliva / drooling',
      'Safe swallowing and effective chewing mechanics'
    ],
    approach: 'Beckman Oral Motor protocol, TalkTools inflatable vibrators/chewies, SOS (Sequential Oral Sensory) feeding approach.',
    faqList: [
      {
        question: 'Is picky eating a sensory or behavioral issue?',
        answer: 'It is often a combination of oral motor weakness and sensory texture aversion. Our comprehensive evaluation determines the exact root cause.'
      }
    ],
    whatsappMessage: 'Hi Jeevan Wings, I need help regarding Oral Motor & Feeding Therapy for my child.'
  }
];

export const INITIAL_CONDITIONS: Condition[] = [
  {
    id: 'speech-delay',
    slug: 'speech-delay',
    name: 'Speech & Language Delay',
    category: 'Communication',
    summary: 'A condition where a child does not reach age-appropriate speech milestones in vocabulary, sentence length, or expression.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    commonSymptoms: [
      'Not babbling by 12 months',
      'Fewer than 10 spoken words at 18 months',
      'Difficulty putting two words together at age 2',
      'Relies heavily on pointing or grunting to communicate'
    ],
    redFlags: [
      'No response to name by 12 months',
      'Loss of previously acquired words or social skills'
    ],
    recommendedTherapyIds: ['speech-language-therapy', 'autism-early-intervention'],
    ageOfOnset: '12 - 30 Months',
    parentTips: [
      'Narrate your daily activities aloud to your child.',
      'Limit screen time (TV/phones) to less than 30 mins daily.',
      'Read picture books together every evening.'
    ]
  },
  {
    id: 'stammering-stuttering',
    slug: 'stammering-stuttering',
    name: 'Stammering & Stuttering (Fluency Disorder)',
    category: 'Communication',
    summary: 'Disruption in the smooth flow of speech characterized by sound repetitions (c-c-cat), prolongations (ssss-sun), or silent blocks.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    commonSymptoms: [
      'Repetition of initial sounds or syllables',
      'Stretching out vowel/consonant sounds',
      'Facial tension or eye blinking during speech attempt',
      'Avoiding speaking in front of peers or teachers'
    ],
    redFlags: [
      'Speech struggles lasting longer than 6 months',
      'Child shows frustration or emotional distress when speaking'
    ],
    recommendedTherapyIds: ['speech-language-therapy', 'behavioral-therapy-aba'],
    ageOfOnset: '2.5 - 6 Years',
    parentTips: [
      'Do not complete sentences for your child; listen patiently.',
      'Speak in a calm, relaxed pace without rushing them.',
      'Maintain steady eye contact while they speak.'
    ]
  },
  {
    id: 'autism-spectrum-disorder',
    slug: 'autism-spectrum-disorder',
    name: 'Autism Spectrum Disorder (ASD)',
    category: 'Neurodevelopmental',
    summary: 'A developmental condition affecting social interaction, verbal & non-verbal communication, and flexible behavior patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    commonSymptoms: [
      'Limited eye contact and sparse social smiling',
      'Repetitive body movements (hand flapping, spinning)',
      'Intense fixation on specific toys or object parts',
      'Difficulty understanding feelings or non-verbal cues'
    ],
    redFlags: [
      'Inability to share enjoyment or point out objects of interest by 14 months',
      'Extreme distress over minor changes in routine'
    ],
    recommendedTherapyIds: ['autism-early-intervention', 'occupational-therapy-sensory', 'speech-language-therapy'],
    ageOfOnset: '12 - 36 Months',
    parentTips: [
      'Maintain predictable daily visual schedules at home.',
      'Use simple, concrete 2-word commands.',
      'Celebrate every small milestone in joint attention.'
    ]
  },
  {
    id: 'sensory-processing-disorder',
    slug: 'sensory-processing-disorder',
    name: 'Sensory Processing Disorder (SPD)',
    category: 'Sensory Motor',
    summary: 'Difficulty taking in, organizing, and responding to sensory input from the surrounding environment.',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800',
    commonSymptoms: [
      'Covers ears tightly at everyday loud sounds (blenders, vacuum)',
      'Refuses tags in clothing or seamless socks',
      'Seeks intense spinning, crashing, or jumping constantly',
      'Frequent tripping or clumsiness'
    ],
    redFlags: [
      'Severe meltdowns triggered by crowds, hair washes, or nail trimming',
      'Extreme aversion to touching mess, sand, or finger paint'
    ],
    recommendedTherapyIds: ['occupational-therapy-sensory'],
    ageOfOnset: '2 - 5 Years',
    parentTips: [
      'Provide weighted lap pads or cozy tight compression vests.',
      'Allow noise-canceling headphones in loud environments.',
      'Integrate heavy-work activities like pushing weighted carts.'
    ]
  },
  {
    id: 'adhd-hyperactivity',
    slug: 'adhd-hyperactivity',
    name: 'ADHD & Attention Deficits',
    category: 'Behavioral',
    summary: 'Persistent patterns of inattention, hyperactivity, and impulsivity that interfere with daily functioning and academic progress.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    commonSymptoms: [
      'Inability to sit still during tabletop tasks or meals',
      'Frequently loses school books, stationery, or toys',
      'Interrupts others and blurts out answers before questions are finished',
      'Struggles to follow step-by-step instructions'
    ],
    redFlags: [
      'Dangerous impulsive running into streets without fear',
      'Severe academic struggle despite normal or above-average intelligence'
    ],
    recommendedTherapyIds: ['behavioral-therapy-aba', 'occupational-therapy-sensory', 'special-education-remedial'],
    ageOfOnset: '4 - 8 Years',
    parentTips: [
      'Break large homework tasks into short 10-minute micro-intervals.',
      'Use timer clocks and visual reward charts.',
      'Ensure ample physical outdoor play before study hours.'
    ]
  }
];

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'kajal-kavita',
    name: 'Kajal Kavita',
    role: 'Founder & Speech Therapist',
    qualification: 'D.El.Ed in Special Education, DHLS',
    experienceYears: 7,
    specialties: ['Speech Therapy', 'Language Delay', 'Stammering & Articulation', 'Special Education', 'Hearing & Speech Rehab'],
    bio: 'Kajal Kavita is an experienced Speech Therapist and Founder of Jeevan Wings Center. Holding credentials in Special Education (D.El.Ed) and Hearing Language & Speech (DHLS) with 7+ years of dedicated clinical experience, she specializes in transforming speech, communication, and developmental milestones in children.',
    rating: 4.9,
    reviewsCount: 380,
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    image: '/images/kajal_kavita.jpg'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: '5-early-warning-signs-speech-delay-toddlers',
    title: '5 Early Warning Signs of Speech Delay in Toddlers Every Noida Parent Should Know',
    excerpt: 'Is your 2-year-old not speaking yet? Learn how to differentiate between normal variation and speech delay, and why early intervention in Sector 75 Noida yields maximum recovery.',
    content: `Speech and language development is one of the most critical milestones during early childhood. Parents in Noida often wonder if their child is just a "late bloomer" or if professional speech therapy is needed.

### 1. Lack of Response to Name by 12 Months
If your child rarely looks at you when you call their name from across the room, it may indicate auditory processing difficulty or joint attention challenges.

### 2. Fewer Than 10 Words at 18 Months
By 18 months, most toddlers have a vocabulary of 15 to 20 functional words (e.g., Mama, Papa, Milk, Bye, Ball). Relying solely on gestures without vocal attempts warrants an evaluation.

### 3. Difficulty Understanding Simple 1-Step Commands
By age 2, children should easily understand "Give me the ball" or "Come here" without pointing.

### 4. Excessive Frustration and Tantrums
When a child cannot express their basic needs verbally, they often resort to crying, screaming, or pulling parents by the hand.

### 5. Absence of Imitation
Children naturally imitate sounds, clapping, and facial expressions. A lack of sound imitation by 15 months is a key clinical sign.

**When to seek help?**
At Jeevan Wings Speech Therapy & Child Development Center in Noida Sector 75, our comprehensive 45-minute clinical evaluation maps your child's exact speech milestones. Early intervention before age 3 unlocks rapid neuro-developmental progress.`,
    category: 'Speech Therapy',
    author: 'Kajal Kavita',
    authorRole: 'Founder & Speech Therapist',
    publishDate: '2026-07-15',
    readTime: '4 Min Read',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
    tags: ['Speech Delay', 'Noida Sector 75', 'Toddler Development', 'Early Intervention'],
    seoMetaTitle: '5 Warning Signs of Speech Delay in Toddlers | Jeevan Wings Noida',
    seoMetaDescription: 'Is your child facing speech delay in Noida? Discover 5 early red flags and learn how early speech therapy at Jeevan Wings Sector 75 transforms communication.'
  },
  {
    id: 'blog-2',
    slug: 'understanding-sensory-processing-disorder-sensory-gym',
    title: 'Understanding Sensory Processing Disorder: How a Sensory Gym Transforms Child Behavior',
    excerpt: 'Does your child melt down during hair washes or cover ears at loud sounds? Discover how sensory integration therapy regulates the nervous system.',
    content: `Sensory Processing Disorder (SPD) occurs when the brain has trouble receiving, organizing, and responding to information that comes through the senses.

### What happens inside a Sensory Integration Gym?
A pediatric sensory gym is not just a playground—it is a clinically calibrated therapeutic environment:
- **Vestibular Swings:** Suspended therapy swings stimulate the inner ear balance centers.
- **Proprioceptive Ball Pits:** Deep pressure input calms an over-stimulated nervous system.
- **Tactile Exploration Wall:** Helps children who fear sticky or fuzzy textures.

**The Jeevan Wings Advantage:**
Our Noida Sector 75 facility features state-of-the-art sensory integration and speech therapy suites supervised by Founder & Speech Therapist Kajal Kavita.`,
    category: 'Occupational Therapy',
    author: 'Kajal Kavita',
    authorRole: 'Founder & Speech Therapist',
    publishDate: '2026-07-10',
    readTime: '5 Min Read',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    tags: ['Sensory Processing', 'Occupational Therapy', 'Sensory Gym', 'Autism Support'],
    seoMetaTitle: 'Sensory Processing Disorder & Sensory Gym Therapy | Jeevan Wings',
    seoMetaDescription: 'Learn how sensory gym occupational therapy in Noida Sector 75 helps children overcome sensory meltdowns and improve fine motor focus.'
  },
  {
    id: 'blog-3',
    slug: 'stammering-treatment-in-children-myths-vs-facts',
    title: 'Stammering Treatment in Children: Myths vs Clinical Facts',
    excerpt: 'Debunking common myths around child stuttering. Learn proven fluency strategies and how emotional support prevents speech anxiety.',
    content: `Stammering (stuttering) affects nearly 5% of young children during peak language acquisition years. Unfortunately, misinformation often leads parents to wait too long before seeking help.

### Myth 1: "They will automatically grow out of it."
**Fact:** While some mild developmental dysfluency resolves, stammering that persists beyond 6 months requires structured speech therapy.

### Myth 2: "Stammering is caused by nervousness or fright."
**Fact:** Stammering is a neurological motor-speech timing difference, not a psychological defect. Anxiety is a consequence, not the root cause.

**Clinical Fluency Techniques at Jeevan Wings:**
We employ Easy Onset, Stretched Speech, Light Articulatory Contact, and Cognitive Reframing to build effortless speech confidence.`,
    category: 'Speech Therapy',
    author: 'Kajal Kavita',
    authorRole: 'Founder & Speech Therapist',
    publishDate: '2026-07-02',
    readTime: '6 Min Read',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
    tags: ['Stammering', 'Stuttering Treatment', 'Fluency Therapy', 'Noida Speech Clinic'],
    seoMetaTitle: 'Stammering Treatment in Children: Facts & Myths | Jeevan Wings',
    seoMetaDescription: 'Effective stammering treatment and speech fluency therapy in Noida Sector 75. Help your child speak with natural ease and confidence.'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sensory Integration Gym & Swings',
    category: 'Sensory Gym',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800',
    altText: 'Pediatric sensory integration gym with swings and soft balance beams at Jeevan Wings Noida',
    description: 'Custom suspended therapy swings for vestibular balance and deep tactile stimulation.'
  },
  {
    id: 'gal-2',
    title: 'Speech & Language Sound Lab',
    category: 'Speech Labs',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800',
    altText: 'Interactive sound lab and mirror articulation station for speech delay therapy',
    description: 'Equipped with mirror feedback, audio-visual vocalizers, and oral motor tools.'
  },
  {
    id: 'gal-3',
    title: 'Play-Based Social Interaction Room',
    category: 'Play Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
    altText: 'Bright play therapy room with colorful educational toys and soft flooring',
    description: 'Designed for turn-taking, peer socialization, and joint attention building.'
  },
  {
    id: 'gal-4',
    title: 'Special Education & Dyslexia Center',
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    altText: 'Multi-sensory special education classroom with tactile reading aids and board visualizers',
    description: 'One-on-one quiet academic remedial modules for children with learning needs.'
  },
  {
    id: 'gal-5',
    title: 'Parent Awareness Workshop on Autism',
    category: 'Events & Workshops',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    altText: 'Pediatric speech therapist addressing parents during a monthly child development seminar in Noida',
    description: 'Monthly free parent empowerment seminars on early developmental red flags.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_LEADS: Lead[] = [];
