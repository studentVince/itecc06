import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamlist } from '../navigation/AppNavigation';
import { Ionicons } from '@expo/vector-icons';


type HomeScreenRouteProp = RouteProp<RootStackParamlist, 'TabHome'>;

type Props = {
  route: HomeScreenRouteProp;
  navigation: any;
};

const HomeScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { userId, from_account_id } = route.params;
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Accounts')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        Alert.alert('Error', 'Failed to fetch balance.');
      } else {
        setBalance(data?.balance || 0);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchBalance(); // Fetch balance whenever the screen comes into focus
      }
    }, [userId])
  );

  const ActionButton = ({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={28} color="#007aff" />
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wallet</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#007aff" />
        ) : (
          <Text style={styles.balanceAmount}>₱{balance?.toFixed(2)}</Text>
        )}
        <TouchableOpacity
          style={styles.cashInButton}
          onPress={() => navigation.navigate('CashIn', { userId: userId,
            from_account_id: from_account_id, })}
        >
          <Text style={styles.cashInText}>+ Cash In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
      <View style={styles.actionsRow}>
        <ActionButton
          title="Send"
          icon="send"
          onPress={() => navigation.navigate('SendScreen', { userId: userId,
            from_account_id: from_account_id, })}
        />
        <ActionButton
          title="Transfer"
          icon="swap-horizontal"
          onPress={() => navigation.navigate('TransferScreen', { userId: userId,
            from_account_id: from_account_id,})}
        />
        <ActionButton
          title="Pay Bills"
          icon="document-text"
          onPress={() => navigation.navigate('BillScreen', { userId: userId,
            from_account_id: from_account_id, })}
        />
      </View>
      </View>

      <View style={styles.actionsRow}>
        <ActionButton
          title="Savings"
          icon="wallet"
          onPress={() => navigation.navigate('SavingScreen', {userId: userId,
            from_account_id: from_account_id,})}
        />
  </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007aff',
  },
  cashInButton: {
    marginTop: 15,
    backgroundColor: '#007aff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cashInText: {
    color: '#fff',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'column', // Allow multiple rows
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    backgroundColor: '#e6f0ff',
    borderRadius: 50,
  },
  actionText: {
    marginTop: 6,
    fontSize: 12,
    color: '#007aff',
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20, // Add spacing between rows
  },
});

export default HomeScreen;
