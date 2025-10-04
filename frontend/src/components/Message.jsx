

function Message({ message }) {
  if (!message.text) {
    return null
  }

  return (
    <div className={`message ${message.isError ? 'error' : 'success'}`}>
      <div dangerouslySetInnerHTML={{ __html: message.text }} />
    </div>
  )
}

export default Message