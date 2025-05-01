**📝 PRD: UK Personal Finance Knowledge Graph "MoneyMap" **

**📌 Problem Statement**

Personal finance is a fragmented topic with valuable resources scattered across books, blogs, newspaper articles, social media posts, and institutional reports. It's difficult for users to find **high-quality, relevant resources** efficiently.

This project aims to build a **comprehensive, structured database of UK personal finance resources** that will evolve into a **Knowledge Graph backend** for a public-facing chat app. The app will enable users to ask personal finance questions and receive accurate, contextual answers, with an initial focus on helping young adults build good financial habits.

**Target Audience:**
- **Phase 1 (MVP):** Personal use by the developer/researcher for collecting and analyzing resources
- **Future Phases:**
  - Young adults seeking financial education
  - Financial educators and content creators
  - General public interested in UK personal finance

**⚡️ tl;dr**

Create a **custom web app database** to store **personal finance resource references (URLs, books, articles, etc.)**, with **manual notes and tags** for now, evolving into an **AI-assisted Knowledge Graph** for **efficient retrieval by key financial concepts**.

**🎯 Goals**

**Business Goals**

1. Build a **centralized knowledge repository** to streamline personal finance information retrieval.

2. Lay the foundation for a **public-facing chat app** that uses the database to answer personal finance questions.

3. Deliver a **working MVP quickly** to allow for easy resource storage and tagging, and iterate over time.

**User Goals**

1. **Quickly store and retrieve relevant finance resources** by concept (e.g., "Mortgages," "Credit Score").

2. Keep **manual notes or action items** attached to each resource.

3. Build a **scalable tagging system** that evolves with user needs.

4. Eventually allow users to **explore connections between financial concepts** in an intuitive way.

**Non-Goals (for MVP)**

1. **AI-assisted tagging** (planned for future iterations).

2. **Handling complex chat queries** directly from the database (this will come once the Knowledge Graph is mature).

**👤 User Stories**

**Phase 1: MVP (Personal Use)**

1. As a user, I want to quickly add resources (URLs, books, articles) to the database so I can keep track of them.

2. As a user, I want to check if a resource already exists to avoid duplication.

3. As a user, I want to add notes and action items to each resource to track my thoughts or next steps.

4. As a user, I want to tag resources with predefined keywords to make them easy to organize and retrieve.

**Phase 2: Knowledge Graph**

5. As a user, I want to search for resources using keywords and key concepts to find what I need faster.

6. As a user, I want to see **related resources** based on **semantic similarity** and connections between topics.

7. As a user, I want to **explore a visual knowledge graph** to discover connections between concepts.

**Phase 3: Public Chat App**

8. As a public user, I want to ask natural-language finance questions and get **resource-backed answers** from the database.

9. As a public user, I want to create an account and save my preferences for **personalized recommendations**.

10. As a public user, I want to search for resources by topic and see relevant results (e.g., "How do I build a pension fund?").

11. As a chat app user, I want to ask questions in natural language and get resource-backed answers.

**📚 User Experience (MVP Flow)**

**MVP Database Flow (Today's Goal)**

1. **Add a New Resource**

• Input fields:

• **URL**

• **Title**

• **Author**

• **Type** (e.g., book, blog, article, video, etc.)

• **Notes** (manual notes or action items)

• **Tags** (select from a predefined list, e.g., #Mortgages, #CreditScore)

2. **View Resources**

• Search by title, author, or tag.

• Filter by type (e.g., "Show me all blog posts about taxes").

3. **Edit Resources**

• Update notes or tags as needed.

**🔧 Technical Considerations**

**Tech Stack**

• **Frontend**: React or Next.js for a fast, responsive web interface.

• **Backend**: Node.js/Express for handling resource storage and API integrations.

• **Database**: PostgreSQL for relational data handling or Firestore for a more scalable NoSQL option.

• **Graph Database**: **Neo4j** for future Knowledge Graph integration.

**Tagging System**

• **Manual tagging** in the MVP with a predefined list of tags.

• Tags should be stored as **relations in the database** to support future AI-assisted tagging.

**Integration with Obsidian**

• Export resources and notes to a local **Obsidian vault**.

• Sync tags between the web app and Obsidian.

**Future Considerations**

1. **Vector Embeddings**

• Use **OpenAI's embeddings API** to generate semantic vectors for resources, enabling more advanced search and retrieval.

2. **Knowledge Graph**

• Store **relationships between resources, tags, and concepts** in a graph database like Neo4j.

• Example: "Pension Planning" → linked to "Retirement," "Tax Efficient Investing," etc.

**📏 Success Metrics**

**Metric** **Description**

**Ease of adding resources** Adding a new resource should take **<30 seconds**.

**Ease of finding resources** The tagging system should make it **easy to retrieve relevant materials** by topic.

**Accuracy of notes** Notes should provide **clear, actionable insights** when reviewing resources.

**Number of resources cataloged** Track progress on building the database.

**Percentage of tagged resources** Ensure at least **50% of resources are tagged** with key concepts.

**🛠 MVP Roadmap**

MVP Features (Phase 1)

Resource Management

- Add new resources (URL, title, type)
-Basic CRUD operations
Bulk import capability (CSV)


Tagging System

Manual tagging from predefined list
Basic taxonomy for financial concepts


Search & Filter

Search by title, type, tags
Basic filtering capabilities


Data Validation

URL validation
Duplicate detection
Required field checking

**Milestone** **Goal** **Estimated Time**

**1. Setup Database** Create the backend to store resources 1-2 hours

**2. Build Input Form** Allow users to add URLs, notes, and tags 2-3 hours

**3. Build Search Function** Enable searching by title, tags, etc. 1-2 hours

**4. Tagging System** Add predefined tags 1 hour

**5. Obsidian Sync** Export resources to Obsidian vault Futuer

**6. AI-Assisted Tagging** Use embeddings to suggest tags Future

**📊 Data Model (MVP)**

**Field** **Description**

**UUID** (Required) Unique identifier for each resource

**URL** (Required) The URL of the resource

**Title** (Required) The title of the resource

**Author** The author or creator of the resource No

**Type** (Required) Type of resource Enumerated: 
-Book
- Blog post
- Newspaper article
- Social media post
- Video
-Institutional resource
- Other 

**Notes** (Optional) Manual notes or action items

**Tags** (Optional) Selected from a predefined list

**Status**(required): Enumerated

To Review
In Analysis
Analyzed
Tagged
Published

**Date Added** The date the resource was added Yes

**Last Modified** The date the resource was last updated Yes

**🚀 Future Roadmap**

1. **Phase 2: Knowledge Graph Construction**

• Full-text storage.

• Vector embeddings for semantic search.

• Entity relationship mapping using Neo4j.

2. **Phase 3: Public Chat App**

• User accounts and preferences.

• Personalized recommendations.

• Public API for external integrations.

7. User Interface Requirements

Phase 1:
Command line interface or simple web form for data entry
Basic CRUD operations
Bulk import/export capability
Simple search and filter interface

Future Phases:
Public web interface with mobile responsive design
User accounts and preferences
Social features (bookmarking, sharing)





