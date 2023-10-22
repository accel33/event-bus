import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;
    if (comment.status === 'aprovado') {
      content = comment.content;
    }
    if (comment.status === 'rechazado') {
      content = 'Este comment ha sido rechazado';
    }
    if (comment.status === 'pending') {
      content = 'Esta comment esta esperando moderacion';
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
