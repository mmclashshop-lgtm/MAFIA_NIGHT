import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { useSocialStore } from '../store/socialStore';
import { useUIStore } from '../store/uiStore';

export function useSocialSocket() {
  const { addToast } = useUIStore();

  const {
    addFriend,
    removeFriend,
    addFriendRequest,
    removeFriendRequest,
    updateFriendStatus,
    setParty,
    addPartyMember,
    removePartyMember,
    updatePartyMemberReady,
    addPartyInvite,
    removePartyInvite,
  } = useSocialStore();

  useEffect(() => {
    const socket = getSocket();

    const onRequest = (data: { fromUserId: string; fromName: string; fromAvatar: string }) => {
      addFriendRequest(data);
      addToast('info', `${data.fromName} sent you a friend request`);
    };

    const onAccepted = (data: { userId: string; name: string; avatar: string }) => {
      removeFriendRequest(data.userId);
      addFriend({ userId: data.userId, name: data.name, avatar: data.avatar, status: 'online', lastActiveAt: Date.now(), elo: 1000, level: 1 });
      addToast('success', `${data.name} accepted your friend request`);
    };

    const onRejected = (data: { userId: string }) => {
      removeFriendRequest(data.userId);
    };

    const onRemoved = (data: { userId: string }) => {
      removeFriend(data.userId);
      addToast('info', 'You have been removed from friends');
    };

    const onOnline = (data: { userId: string; status: 'online' | 'in_game' | 'idle' | 'offline' }) => {
      updateFriendStatus(data.userId, data.status);
    };

    const onInvite = (data: { partyId: string; fromName: string }) => {
      addPartyInvite(data);
      addToast('info', `${data.fromName} invited you to a party`);
    };

    const onMemberJoined = (data: { userId: string; name: string }) => {
      const store = useSocialStore.getState();
      if (store.party) {
        addPartyMember({ userId: data.userId, name: data.name, avatar: '', isLeader: false, ready: false });
      }
    };

    const onLeft = (data: { userId: string }) => {
      removePartyMember(data.userId);
    };

    const onReady = (data: { userId: string; ready: boolean }) => {
      updatePartyMemberReady(data.userId, data.ready);
    };

    const onDisbanded = () => {
      setParty(null, null);
    };

    socket.on('friend:request', onRequest);
    socket.on('friend:request-accepted', onAccepted);
    socket.on('friend:request-rejected', onRejected);
    socket.on('friend:removed', onRemoved);
    socket.on('friend:online', onOnline);
    socket.on('party:invite', onInvite);
    socket.on('party:member-joined', onMemberJoined);
    socket.on('party:member-left', onLeft);
    socket.on('party:member-ready', onReady);
    socket.on('party:disbanded', onDisbanded);

    return () => {
      socket.off('friend:request', onRequest);
      socket.off('friend:request-accepted', onAccepted);
      socket.off('friend:request-rejected', onRejected);
      socket.off('friend:removed', onRemoved);
      socket.off('friend:online', onOnline);
      socket.off('party:invite', onInvite);
      socket.off('party:member-joined', onMemberJoined);
      socket.off('party:member-left', onLeft);
      socket.off('party:member-ready', onReady);
      socket.off('party:disbanded', onDisbanded);
    };
  }, []);
}
