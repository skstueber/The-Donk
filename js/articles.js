// js/articles.js - Article Data Structure
const articlesData = [
  {
    id: "from-jedi-to-king",
    title: "From Jedi to King",
    description: "Trump and his AI-powered propaganda campaign",
    author: "Anonymous",
    date: "2025-12-05",
    displayDate: "Dec. 5, 2025",
    image: "img/from-jedi-to-king.webp",
    content: "None of us are strangers to Donald Trump's online presence. Before it was Truth Social it was Twitter (about 57,000 times), but now its AI generated images, ChatGPT, and pretty much all the generative content the English department at UChicago has devoted themselves to destroying. And that feels normal to see on social media right? I mean, we all see AI generated images on our for you pages, and at this point it might be hard to define internet culture and trends without it...",
    featured: false
  },
  {
    id: "swinging-back-to-blue",
    title: "Swinging Back to Blue",
    description: "Key Takeaways From Election Night in PA and GA",
    author: "Anonymous",
    date: "2025-11-16",
    displayDate: "Nov. 16, 2025",
    image: "img/swinging-back-to-blue.webp",
    content: "",
    featured: false
  },
  {
    id: "did-something-good-actually-just-happen",
    title: "Did Something Good Actually Just Happen?",
    description: "Woke is once again the backbone of American democracy.",
    author: "By <i>The Donk!</i> Editorial Board",
    date: "2025-11-07",
    displayDate: "Nov. 7, 2025",
    image: "img/did-something-good-actually-just-happen.webp",
    content: "",
    featured: false
  },
  {
    id: "thank-you-comrade-trump",
    title: "Thank You, Comrade Trump?",
    description: "How Trump fulfilled a Leftist dream.",
    author: "By Landon Pungarcher",
    date: "2025-11-03",
    displayDate: "Nov. 3, 2025",
    image: "img/thank-you-comrade-trump.png",
    content: "",
    featured: false
  },
  {
    id: "ironyposting-yourself-into-nazism",
    title: "Ironyposting Yourself Into Nazism",
    description: "When Edginess Edges into Fascism",
    author: "By Stone Grayson",
    date: "2025-10-20",
    displayDate: "Oct. 20, 2025",
    image: "img/ironyposting-yourself-into-nazism.png",
    content: "",
    featured: false
  },
  {
    id: "advils-new-advertisement-campaign",
    title: "Advil's New Advertisement Campaign",
    description: "Tylenol, Autism, and the Brainworm at the Forefront of Science",
    author: "Anonymous",
    date: "2025-10-14",
    displayDate: "Oct. 14, 2025",
    image: "img/advils-new-advertisement-campaign.webp",
    content: "",
    featured: false
  },
  {
    id: "ts-and-ps",
    title: "Ts&Ps",
    description: "Free Speech, Political Violence, and the Essence of a Tolerant Society",
    author: "Anonymous",
    date: "2025-10-01",
    displayDate: "Oct. 1, 2025",
    image: "img/ts-and-ps.webp",
    content: "",
    featured: false
  },
  {
    id: "how-trump-decimated-the-australian-right",
    title: "How Trump Decimated the Australian Right",
    description: "Trump's re-election was supposed to help Australia's Right. Instead, it blew them to pieces",
    author: "By Will Vanman",
    date: "2025-05-25",
    displayDate: "May. 25, 2025",
    image: "img/how-trump-decimated-the-australian-right.webp",
    content: "",
    featured: false
  },
  {
    id: "beating-a-dead-donkey",
    title: "Beating a Dead Donkey",
    description: "David Hogg, Malcom Kenyatta, and the DNC's inability to do literally anything ever",
    author: "By Emily Price",
    date: "2025-05-21",
    displayDate: "May. 21, 2025",
    image: "img/beating-a-dead-donkey.webp",
    content: "",
    featured: false
  },
  {
    id: "housing-in-the-land-of-lincoln",
    title: "Housing in the Land of Lincoln",
    description: "How You Can Make a Difference Close to Home",
    author: "By Morgan Walker",
    date: "2025-05-20",
    displayDate: "May. 20, 2025",
    image: "img/housing-in-the-land-of-lincoln.webp",
    content: "",
    featured: false
  },
  {
    id: "help-im-being-canceled",
    title: "HELP I'M BEING CANCELED",
    description: "Has \"Cancel Culture\" been defeated once and for all?",
    author: "By Kai Foster",
    date: "2025-05-20",
    displayDate: "May. 20, 2025",
    image: "img/help-im-being-cancelled.webp",
    content: "",
    featured: false
  },
  {
    id: "unpacking-the-wacky-ideology-of-the-paypal-mafia",
    title: "Unpacking the Wacky Ideology of The PayPal Mafia",
    description: "Campaign finance disclosures reveal unprecedented spending levels ahead of upcoming electoral contests.",
    author: "By Will Vanman",
    date: "2025-05-14",
    displayDate: "May. 14, 2025",
    image: "img/unpacking-the-wacky-ideology-of-the-paypal-mafia.webp",
    content: "",
    featured: false
  },
  {
    id: "the-wealthy-and-the-damned",
    title: "The Wealthy and The Damned",
    description: "What is fair under a second Trump administration?",
    author: "By Addison Marshall",
    date: "2025-05-13",
    displayDate: "May. 13, 2025",
    image: "img/the-wealthy-and-the-damned.webp",
    content: "",
    featured: false
  },
  {
    id: "what-the-hell-just-happened-at-usg",
    title: "What the Hell Just Happened at USG?",
    description: "A story of impeachment, deep state bureaucrats and procedural hijinks",
    author: "By Stone Grayson",
    date: "2025-05-10",
    displayDate: "May. 10, 2025",
    image: "img/what-the-hell-just-happened-at-usg.webp",
    content: "",
    featured: false
  },
  {
    id: "a-tariff-man-through-and-through",
    title: "\"A Tariff Man Through and Through!\"",
    description: "How Trump's favorite president ruined the Republican Party",
    author: "By Stone Grayson",
    date: "2025-05-06",
    displayDate: "May. 6, 2025",
    image: "img/a-tariff-man-through-and-through.webp",
    content: "",
    featured: false
  }
];
// Helper functions
function getFeaturedArticle() {
  return articlesData.find(article => article.featured);
}
function getRegularArticles() {
  return articlesData.filter(article => !article.featured);
}
function getArticleById(id) {
  return articlesData.find(article => article.id === id);
}
// Export for use in Node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { articlesData, getFeaturedArticle, getRegularArticles, getArticleById };
}
