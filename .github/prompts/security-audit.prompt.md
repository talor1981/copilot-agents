---
agent: ask
---

Perform a security audit of the recent code changes in the `app/dashboard` directory. Focus on identifying any potential security vulnerabilities, such as improper handling of user input, insufficient authentication or authorization checks, and any other common security issues. Provide a detailed report of your findings and suggest improvements to enhance the security of the application.

Output your findings in a clear and concise manner, categorizing them based on severity (e.g., critical, high, medium, low) and providing specific recommendations for each identified issue.
And arrange these findings in a table with these columns: "ID", "Title",,"Description", "Severity","Risk","File name","Recommendation", "Code Required"

Next, ask the user which issues they want to fix by either replying "all" , or comma separated list of IDs. after their reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple `subAgentSuccess: true | false`.