export const getSender = (loggedUser, users) => {
  //paarmeters : 1.loggedUser, 2.users array

  //If users[0] array id is equal to logged user id then display user[1] name or chatted(friends) user name users[0].name (users array).
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  //paarmeters : 1.loggedUser, 2.users array for selectedChat user.

  //If users[0] array id is equal to logged user id then display user[1] selected chat name or selected chat name (users array)users[0].name.
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

//Logic for displaying the chats in correct order for chatting users.
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );

  /* The Logic : The `isSameSender` function is used to determine whether the current message (`m`) is from the same sender as the next message in the `messages` array, with some additional conditions that help display the chat messages correctly in a chat interface.

Let's break down the function step by step:

### Parameters:
- `messages`: This is the list (array) of all messages in the chat.
- `m`: This is the current message (i.e., the one being checked).
- `i`: This is the index of the current message `m` in the `messages` array.
- `userId`: This is the ID of the currently logged-in user (the person viewing the chat).

### Function Logic:
The function returns a boolean value (`true` or `false`) based on the conditions described below. 

1. **`i < messages.length - 1`**:
   - This condition checks if the current message (`m`) is not the last message in the list. 
   - It is necessary because we need to compare the current message with the next one (`messages[i + 1]`), so if the current message is the last one, there is no "next" message to compare.

2. **`messages[i + 1].sender._id !== m.sender._id`**:
   - This checks if the next message in the list (`messages[i + 1]`) is from a different sender compared to the current message (`m`).
   - If the sender's `_id` of the next message is different from the sender's `_id` of the current message, then the messages are from different users, and we need to handle them accordingly in the chat UI (such as showing the sender's name or avatar).

3. **`messages[i + 1].sender._id === undefined`**:
   - This condition checks if the next message (`messages[i + 1]`) does not have a sender ID (perhaps a system message or some other case where the sender information is missing).
   - If this is true, the current message should be considered as a "new" message that needs to be displayed properly in the chat.

4. **`messages[i].sender._id !== userId`**:
   - This checks if the current message (`m`) is not sent by the user who is currently viewing the chat (`userId`).
   - If this condition is true, it means that the current message is from a different user, and the system may want to display information like the sender's name or avatar.

### Summary:
The function determines whether the current message (`m`) is the last message from a different sender. It considers the following conditions:
- The next message is from a different sender (or the next message lacks a sender).
- The current message is not sent by the user viewing the chat.

This is useful in chat applications to manage the display of messages in a way that improves user experience:
- Messages from the same sender may be grouped together without needing to show the sender’s name or avatar repeatedly.
- Messages from different senders will have the sender’s name/avatar displayed.

So, this logic helps determine whether or not you should display additional details like the sender’s name/avatar for each message based on whether the sender changes between consecutive messages.
  
*/
};

//Logic for displaying the last message form which user.
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );

  /*
    Logic: The function isLastMessage checks whether a given message (indexed by i) is the last message in the array messages and whether it was sent by a different user than the one identified by userId. Here's the breakdown:

Parameters:-
messages: An array of message objects, where each message typically contains details such as sender (who sent the message) and the message's content.

i: The index of the current message being checked in the loop or iteration.

userId: The identifier of the current user.

Logic Explanation:-
i === messages.length - 1: This checks if the current message (messages[i]) is the last message in the messages array. It compares the index i with messages.length - 1, which is the index of the last element in the array.

messages[messages.length - 1].sender._id !== userId: This part checks whether the sender of the last message is not the current user. It does this by accessing the sender._id of the last message (messages[messages.length - 1]) and comparing it with the provided userId.

messages[messages.length - 1].sender._id: This part ensures that the function returns the ID of the sender of the last message (only if the previous condition is true). Essentially, it returns the sender's ID of the last message in the list if it's not sent by the current user.

Combined Logic:
The function first checks if the message at index i is the last message in the array.
Then, it ensures that the sender of the last message is not the current user (userId).
If both conditions are true, it returns the ID of the sender of the last message.

  */
};

//Logic for aligin the chats for sender and recevier.
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }

  /*

  Logic: The function isSameSenderMargin is designed to determine the appropriate margin or alignment for chat messages based on the sender of the message and the current user. The logic helps in aligning chat messages differently depending on whether the sender of the message is the same as the previous message, and whether the message belongs to the current user or someone else.

Here's a breakdown of the logic:

Parameters:
1. messages: An array of message objects. Each message has a sender object that contains the sender's unique ID (_id), among other details.
2. m: The current message object being evaluated.
3. i: The index of the current message (m) in the messages array.
4. userId: The ID of the current user (this helps distinguish whether the current message is sent by the user or someone else).

The function calculates the margin for the current message (m) based on the following conditions:

1. First Condition : if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId)
    i) This checks if the current message (m) is not the last one (i < messages.length - 1), the next message is from the same sender (messages[i + 1].sender._id === m.sender._id), and the current message is not sent by the current user (messages[i].sender._id !== userId).
    
    ii) If this condition is met, the function returns 33, which is likely a margin value to adjust the alignment of the message (e.g., to create a gap or some spacing between messages from the same sender).

2. Second Condition : 
  else if (
  (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) ||
  (i === messages.length - 1 && messages[i].sender._id !== userId)
)

This condition checks two scenarios.
i) Scenario 1: The current message is not the last one, the next message is from a different sender, and the current message is not sent by the current user (messages[i].sender._id !== userId).

ii) Scenario 2: The current message is the last one, and it is not sent by the current user (messages[i].sender._id !== userId).

Overall : If either of these conditions is true, it returns 0, indicating that the current message should be aligned with no margin (likely meaning the message will be aligned to the left or right, depending on the sender).


3. Else Block (Default Case): 
else {
  return "auto";
}

i) If none of the previous conditions are met, the function returns "auto", which likely allows for automatic margin adjustment, probably positioning the message in a default way, depending on the chat UI's layout.
****** End *****

The Logic Purpose: Purpose: The function aims to handle the alignment of messages in a chat interface in a more dynamic and user-friendly way:

i) It ensures that consecutive messages from the same sender appear more compact (without unnecessary gaps between them).

ii) It keeps the messages from the current user aligned in a way that differentiates them from other users' messages, potentially with an automatic alignment based on the UI's styling.

  */
};

//Logic for isSameUser method means isSameUser checks if two consecutive messages in a list were sent by the same user.
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;

  /*
The function isSameUser checks if two consecutive messages in a list were sent by the same user. Let's break it down:

Parameters:-
1) messages: An array of message objects.
2) m: The current message object.
3) i: The index of the current message (m) in the messages array.

Function Explanation:

  1) i > 0 :  This checks if the current message (m) is not the first message in the list. If i is 0, it means m is the very first message, so there's no previous message to compare it to. This condition ensures that the function won't try to compare the first message with a non-existent previous message.

  2) messages[i - 1].sender._id === m.sender._id  :  his compares the sender's ID of the previous message (messages[i - 1]) with the sender's ID of the current message (m).
  i)messages[i - 1] gives the message before the current one.
  ii).sender._id accesses the unique identifier (_id) of the sender of both messages.

  Final Outcome: 
  1. if true : The function returns true if the current message is not the first message, and the sender of the previous message is the same as the sender of the current message (i.e., the same user sent both messages).

  2. if false : The sender of the current message is different from the sender of the previous message.
 
  */
};
