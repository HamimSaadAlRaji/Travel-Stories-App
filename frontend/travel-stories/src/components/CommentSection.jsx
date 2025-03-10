import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const CommentSection = ({ storyId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(
          `/stories/${storyId}/comments`
        );
        setComments(response.data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [storyId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/stories/${storyId}/comments`,
        {
          content: newComment,
        }
      );

      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axiosInstance.post(
        `/stories/${storyId}/comments/${commentId}/like`
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: response.data.likes }
            : comment
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleAddReply = async (commentId, content) => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/stories/${storyId}/comments/${commentId}/reply`,
        { content }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data.reply] }
            : comment
        )
      );
      setReply({ ...reply, [commentId]: "" });
    } catch (err) {
      console.error("Error adding reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Comments</h2>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
      {comments.map((comment) => (
        <div key={comment._id} className="mb-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{comment.user.name}</p>
              <p className="text-gray-600">{comment.content}</p>
            </div>
            <button
              onClick={() => handleLikeComment(comment._id)}
              className="text-blue-500"
            >
              👍 {comment.likes}
            </button>
          </div>
          <div className="ml-4 mt-2">
            {comment.replies.map((reply) => (
              <div key={reply._id} className="ml-4">
                <p>
                  <strong>{reply.user.name}:</strong> {reply.content}
                </p>
              </div>
            ))}
            <textarea
              className="w-full p-2 border rounded mt-2"
              placeholder="Reply..."
              value={reply[comment._id] || ""}
              onChange={(e) =>
                setReply({ ...reply, [comment._id]: e.target.value })
              }
            />
            <button
              onClick={() => handleAddReply(comment._id, reply[comment._id])}
              className="bg-gray-300 text-sm px-3 py-1 mt-2 rounded hover:bg-gray-400"
            >
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
