/**
 * Chat Screen
 * Direct messaging with friends
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, Avatar, IconButton } from '@components/base';
import { useTheme, spacing, borderRadius, colors as themeColors } from '@theme/index';
import { Message, UserSummary } from '@domain/entities';

// Mock data
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    chatId: 'chat1',
    senderId: 'other',
    senderName: 'Priya',
    content: 'Hey! Are you coming to the football match tomorrow?',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    chatId: 'chat1',
    senderId: 'me',
    senderName: 'You',
    content: 'Yes! Really excited for it 🙌',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: '3',
    chatId: 'chat1',
    senderId: 'other',
    senderName: 'Priya',
    content: 'Great! I heard they have a really good team this time',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: '4',
    chatId: 'chat1',
    senderId: 'me',
    senderName: 'You',
    content: 'Yeah, should be fun! What time should we meet?',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: '5',
    chatId: 'chat1',
    senderId: 'other',
    senderName: 'Priya',
    content: 'Let\'s meet at the entrance at 9:30 AM. The match starts at 10.',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3200000).toISOString(),
  },
  {
    id: '6',
    chatId: 'chat1',
    senderId: 'me',
    senderName: 'You',
    content: 'Perfect! See you there 👍',
    type: 'text',
    isRead: true,
    createdAt: new Date(Date.now() - 3100000).toISOString(),
  },
];

const MOCK_USER: UserSummary = {
  id: 'other',
  displayName: 'Priya Sharma',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  isOnline: true,
  averageRating: 4.8,
};

interface ChatScreenProps {
  chatId: string;
  onBack: () => void;
  onProfilePress: () => void;
}

const MessageBubble: React.FC<{
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  index: number;
}> = ({ message, isMe, showAvatar, index }) => {
  const { colors, primary } = useTheme();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 30).springify()}
      style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther,
      ]}
    >
      {!isMe && showAvatar && (
        <Avatar source={message.senderAvatar} name={message.senderName} size="small" />
      )}
      {!isMe && !showAvatar && <View style={styles.avatarPlaceholder} />}
      <View
        style={[
          styles.messageBubble,
          isMe
            ? [styles.messageBubbleMe, { backgroundColor: primary.purple }]
            : [styles.messageBubbleOther, { backgroundColor: colors.surface }],
        ]}
      >
        <Text
          variant="body"
          style={{ color: isMe ? '#FFFFFF' : colors.text }}
        >
          {message.content}
        </Text>
        <Text
          variant="tiny"
          style={[
            styles.messageTime,
            { color: isMe ? 'rgba(255,255,255,0.6)' : colors.textTertiary },
          ]}
        >
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
};

export const ChatScreen: React.FC<ChatScreenProps> = ({
  chatId,
  onBack,
  onProfilePress,
}) => {
  const { colors, primary } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: 'me',
      senderName: 'You',
      content: inputText.trim(),
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, chatId]);

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const isMe = item.senderId === 'me';
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const showAvatar = !isMe && (!prevMessage || prevMessage.senderId !== item.senderId);

      return (
        <MessageBubble
          message={item}
          isMe={isMe}
          showAvatar={showAvatar}
          index={index}
        />
      );
    },
    [messages]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton icon="arrow-back" variant="ghost" onPress={onBack} />
        <TouchableOpacity
          style={styles.headerProfile}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onProfilePress();
          }}
          activeOpacity={0.7}
        >
          <Avatar
            source={MOCK_USER.avatarUrl}
            name={MOCK_USER.displayName}
            size="small"
            showOnline
            isOnline={MOCK_USER.isOnline}
          />
          <View style={styles.headerInfo}>
            <Text variant="bodyMedium">{MOCK_USER.displayName}</Text>
            <Text variant="caption" color={MOCK_USER.isOnline ? 'success' : 'tertiary'}>
              {MOCK_USER.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </TouchableOpacity>
        <IconButton icon="ellipsis-vertical" variant="ghost" onPress={() => {}} />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + spacing.sm,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() ? primary.purple : colors.disabled,
                },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  headerInfo: {
    marginLeft: spacing.sm,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: spacing.xs,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  messageBubbleMe: {
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    borderBottomLeftRadius: 4,
    marginLeft: spacing.xs,
  },
  messageTime: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  attachButton: {
    padding: spacing.xs,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;

