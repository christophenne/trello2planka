const getImportedCommentText = (trelloComment) => {
    return `
${trelloComment.data.text}

---
*Note: imported comment, originally posted by
${trelloComment.memberCreator.fullName} (${trelloComment.memberCreator.username}) on ${trelloComment.date}*`
}

exports.getImportedCommentText = getImportedCommentText;
