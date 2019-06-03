import * as ActionTypes from "./ActionTypes";

export const comments = (state = { errMess: null, comments: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return { ...state, errMess: null, comments: action.payload };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload };

    /**
     * Look here for the second assignment!
     */
    case ActionTypes.ADD_COMMENT:
      const newComment = action.payload;
      newComment.id =
        Math.max(...state.comments.map(comment => comment.id)) + 1;
      return { ...state, comments: [...state.comments, newComment] };
    default:
      return state;
  }
};
