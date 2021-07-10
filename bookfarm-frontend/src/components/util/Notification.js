
import { NotificationManager } from 'react-notifications';

const createNotification = (message, type) => {
  switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message);
        break;
      case 'warning':
        NotificationManager.warning(message);
        break;
      case 'error':
        NotificationManager.error(message);
        break;
  }
}

export default createNotification;
