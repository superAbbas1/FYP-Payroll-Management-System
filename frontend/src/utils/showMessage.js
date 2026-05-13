const showMessage = (message, type = 'info', duration) => {
  window.dispatchEvent(
    new CustomEvent('app-message', {
      detail: { message, type, duration },
    })
  );
};

export default showMessage;
