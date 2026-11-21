import type {Component} from 'vue';
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  LifebuoyIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import type {IconName} from '@/types/dashboard';

const icons: Record<IconName, Component> = {
  'user': UserIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'chat-bubble-left': ChatBubbleLeftIcon,
  'lifebuoy': LifebuoyIcon,
  'envelope': EnvelopeIcon,
  'document': DocumentIcon,
  'document-text': DocumentTextIcon,
  'exclamation-triangle': ExclamationTriangleIcon,
  'heart': HeartIcon,
  'shopping-bag': ShoppingBagIcon,
  'calendar': CalendarIcon,
  'clipboard-document-check': ClipboardDocumentCheckIcon,
  'truck': TruckIcon,
};

export function iconFor(name: IconName): Component {
  return icons[name] ?? DocumentIcon;
}
