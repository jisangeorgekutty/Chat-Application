import React, { useEffect, useRef } from 'react'
import { useMessageStore } from '../store/useMessageStore'
import ChatHeader from './ChatHeader';
import MessageType from './MessageType';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

function ChatContainer() {
  const { messages, selectedUser, getMessages, isMessagesLoading,listenToMessages,unListenToMessage } = useMessageStore();
  const { authUser } = useAuthStore();
  const messageEndRef=useRef(null);
  
  // console.log("USER", selectedUser._id);
  // console.log("MESSAGES", messages);

  useEffect(() => {
      getMessages(selectedUser._id);
      listenToMessages();

      return ()=> unListenToMessage();
    
  }, [selectedUser?._id, getMessages,listenToMessages,unListenToMessage]);

  // useEffect(()=>{
  //   if(messageEndRef.current && messages){
  //     messageEndRef.current.scrollIntoView({behavior:"smooth"});
  //   }
  // },[messages])

  
  if (isMessagesLoading) {
    return (
      <div className="flec-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageType />
      </div>
    )
  }


  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >

            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.jpg"
                      : selectedUser.profilePic || "/avatar.jpg"
                  }
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="chat"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageType />
    </div>
  )
}

export default ChatContainer