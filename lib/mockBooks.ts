export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  chapters?: Chapter[];
  metadata?: {
    description?: string;
    publisher?: string;
    publishedDate?: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Note {
  id: string;
  bookId: string;
  text: string;
  selectedText: string;
  chapter: number;
  timestamp: number;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    progress: 32,
    chapters: [
      {
        id: "ch1",
        title: "Part One: Chapter I",
        content: `
          <h1>Part One: Chapter I</h1>
          <p>It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.</p>
          <p>The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.</p>
          <p>Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week.</p>
          <p>The author describes an interesting contradiction here that will become important later in the story. The protagonist faces a choice that will define their journey through this dystopian world.</p>
        `,
        order: 1
      },
      {
        id: "ch2",
        title: "Part One: Chapter II",
        content: `
          <h1>Part One: Chapter II</h1>
          <p>As he put his hand to the door-knob Winston saw that he had left the diary open on the table. DOWN WITH BIG BROTHER was written all over it, in letters almost big enough to be legible across the room. It was an inconceivably stupid thing to have done.</p>
          <p>He went to the bathroom and carefully scraped away the dirt under his fingernails. He remembered wondering vaguely whether in the abolished past it had been a normal experience to lie in a cool bath. Nowadays it was impossible.</p>
          <p>The telescreen received and transmitted simultaneously. Any sound that Winston made, above the level of a very low whisper, would be picked up by it; moreover, so long as he remained within the field of vision which the metal plaque commanded, he could be seen as well as heard.</p>
        `,
        order: 2
      }
    ],
    metadata: {
      description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
      publisher: "Secker & Warburg",
      publishedDate: "1949"
    }
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    progress: 78,
    chapters: [
      {
        id: "ch1-mockingbird",
        title: "Chapter 1",
        content: `
          <h1>Chapter 1</h1>
          <p>When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body, his thumb parallel to his thigh.</p>
          <p>When enough years had gone by to enable us to look back on them, we sometimes discussed the events leading to his accident. I maintain that the Ewells started it all, but Jem, who was four years my senior, said it started long before that.</p>
          <p>Maycomb was an old town, but it was a tired old town when I first knew it. In rainy weather the streets turned to red slop; grass grew on the sidewalks, the courthouse sagged in the square.</p>
        `,
        order: 1
      }
    ],
    metadata: {
      description: "A novel about the serious issues of rape and racial inequality told through the eyes of a child.",
      publisher: "J.B. Lippincott & Co.",
      publishedDate: "1960"
    }
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    progress: 45,
    chapters: [
      {
        id: "ch1-pride",
        title: "Chapter 1",
        content: `
          <h1>Chapter 1</h1>
          <p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
          <p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
          <p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p>
          <p>Mr. Bennet replied that he had not.</p>
          <p>"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."</p>
        `,
        order: 1
      }
    ],
    metadata: {
      description: "A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.",
      publisher: "T. Egerton",
      publishedDate: "1813"
    }
  },
  {
    id: "4",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    progress: 12,
    chapters: [
      {
        id: "ch1-gatsby",
        title: "Chapter I",
        content: `
          <h1>Chapter I</h1>
          <p>In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.</p>
          <p>"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."</p>
          <p>He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.</p>
          <p>In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.</p>
        `,
        order: 1
      }
    ],
    metadata: {
      description: "A tragic story of Jay Gatsby and his pursuit of the American Dream in the Jazz Age.",
      publisher: "Charles Scribner's Sons",
      publishedDate: "1925"
    }
  },
  {
    id: "5",
    title: "Moby-Dick",
    author: "Herman Melville",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    progress: 5,
    chapters: [
      {
        id: "ch1-moby",
        title: "Chapter 1: Loomings",
        content: `
          <h1>Chapter 1: Loomings</h1>
          <p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>
          <p>It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time to get to sea as soon as I can.</p>
        `,
        order: 1
      }
    ],
    metadata: {
      description: "The narrative of Captain Ahab's obsessive quest to revenge himself on Moby Dick, the giant white whale.",
      publisher: "Harper & Brothers",
      publishedDate: "1851"
    }
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    progress: 89,
    chapters: [
      {
        id: "ch1-catcher",
        title: "Chapter 1",
        content: `
          <h1>Chapter 1</h1>
          <p>If you really want to hear about it, the first thing you'll probably want to know is where I was born, and what my lousy childhood was like, and how my parents were occupied and all before they had me, and all that David Copperfield kind of crap, but I don't feel like going into it, if you want to know the truth.</p>
          <p>In the first place, that stuff bores me, and in the second place, my parents would have about two hemorrhages apiece if I told anything pretty personal about them. They're quite touchy about anything like that, especially my father.</p>
          <p>They're nice and all—I'm not saying that—but they're also touchy as hell. Besides, I'm not going to tell you my whole goddam autobiography or anything. I'll just tell you about this madman stuff that happened to me around last Christmas just before I got pretty run-down and had to come out here and take it easy.</p>
        `,
        order: 1
      }
    ],
    metadata: {
      description: "A story about teenage rebellion and alienation, narrated by Holden Caulfield.",
      publisher: "Little, Brown and Company",
      publishedDate: "1951"
    }
  }
];

export const mockNotes: Note[] = [
  {
    id: "n1",
    bookId: "1",
    text: "The author describes an interesting contradiction here that will become important later in the story.",
    selectedText: "interesting contradiction",
    chapter: 1,
    timestamp: 1732552361
  },
  {
    id: "n2",
    bookId: "1",
    text: "This choice seems to be the turning point of the entire narrative.",
    selectedText: "choice that will define their journey",
    chapter: 1,
    timestamp: 1732552400
  },
  {
    id: "n3",
    bookId: "2",
    text: "Key insight about the ethical implications of AI development.",
    selectedText: "touching on ethics, society",
    chapter: 1,
    timestamp: 1732552500
  }
];