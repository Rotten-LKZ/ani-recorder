import { Notify } from 'quasar'
import type { QNotifyCreateOptions } from 'quasar'

export default {
  negative: n('negative'),
  positive: n('positive'),
  info: n('info'),
}

function n(type: QNotifyCreateOptions['type']) {
  return (message: string, position?: QNotifyCreateOptions['position']) => {
    Notify.create({
      type: type,
      message,
      position: position ?? 'bottom-right',
      group: false,
    })
  }
}
