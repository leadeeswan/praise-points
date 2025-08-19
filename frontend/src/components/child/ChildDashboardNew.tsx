import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Fab
} from '@mui/material';
import {
  Stars as StarsIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Logout as LogoutIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { ChildProfileResponse, PointTransactionResponse, PurchaseHistoryResponse, RewardListResponse } from '../../types';
import { useChildAuth } from '../../contexts/ChildAuthContext';
import axios from 'axios';

const ChildDashboardNew: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { logoutChild } = useChildAuth();
  
  const [child, setChild] = useState<ChildProfileResponse | null>(null);
  const [rewards, setRewards] = useState<RewardListResponse[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransactionResponse[]>([]);
  const [purchases, setPurchases] = useState<PurchaseHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedReward, setSelectedReward] = useState<RewardListResponse | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [cancelingPurchase, setCancelingPurchase] = useState<number | null>(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  // API 호출 함수들
  const childAPI = {
    getProfile: () => 
      axios.get<ChildProfileResponse>(`http://localhost:8080/api/child-dashboard/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data),
    
    getPointHistory: () =>
      axios.get<PointTransactionResponse[]>(`http://localhost:8080/api/child-dashboard/points/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data),
    
    getPurchaseHistory: () =>
      axios.get<PurchaseHistoryResponse[]>(`http://localhost:8080/api/child-dashboard/purchases`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data),
    
    getAvailableRewards: () =>
      axios.get<RewardListResponse[]>(`http://localhost:8080/api/child-dashboard/rewards/available`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data),
    
    requestPurchase: (rewardId: number) =>
      axios.post<PurchaseHistoryResponse>(`http://localhost:8080/api/child-dashboard/purchase`, { rewardId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data),
    
    cancelPurchase: (purchaseId: number) =>
      axios.delete<PurchaseHistoryResponse>(`http://localhost:8080/api/child-dashboard/purchase/${purchaseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('childToken')}` }
      }).then(res => res.data)
  };

  useEffect(() => {
    if (childId) {
      fetchData();
    }
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childData, rewardsData, historyData, purchasesData] = await Promise.all([
        childAPI.getProfile(),
        childAPI.getAvailableRewards(),
        childAPI.getPointHistory(),
        childAPI.getPurchaseHistory()
      ]);
      
      setChild(childData);
      setRewards(rewardsData);
      setPointHistory(historyData);
      setPurchases(purchasesData);
    } catch (error) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRewardClick = (reward: RewardListResponse) => {
    setSelectedReward(reward);
    setConfirmDialog(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!selectedReward || !child) return;

    setPurchasing(true);
    setError('');

    try {
      await childAPI.requestPurchase(selectedReward.id);
      await fetchData();
      setConfirmDialog(false);
      setSelectedReward(null);
    } catch (error: any) {
      // 백엔드에서 반환하는 에러 메시지 처리
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("구매 요청에 실패했습니다.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const canAfford = (reward: RewardListResponse) => {
    return child ? child.availablePoints >= reward.requiredPoints : false;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '승인 대기';
      case 'APPROVED':
        return '승인됨';
      case 'REJECTED':
        return '거절됨';
      default:
        return status;
    }
  };

  // 포인트 통계 계산
  const earnedPoints = pointHistory.filter(t => t.transactionType === 'EARN')
    .reduce((sum, t) => sum + t.points, 0);
  const spentPoints = pointHistory.filter(t => t.transactionType === 'SPEND')
    .reduce((sum, t) => sum + t.points, 0);

  const handleCancelPurchase = async (purchaseId: number) => {
    setCancelingPurchase(purchaseId);
    setError('');

    try {
      await childAPI.cancelPurchase(purchaseId);
      await fetchData();
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("구매 요청 취소에 실패했습니다.");
      }
    } finally {
      setCancelingPurchase(null);
    }
  };

  const handleLogout = () => {
    logoutChild();
    navigate('/child-login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!child) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="error">
            아이 정보를 찾을 수 없습니다.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 로그아웃 버튼 */}
      <Fab
        color="secondary"
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
        onClick={handleLogout}
      >
        <LogoutIcon />
      </Fab>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 헤더 - 아이 정보 */}
        <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
          <CardContent>
            <Box display="flex" alignItems="center" color="white">
              <Avatar
                sx={{ width: 64, height: 64, mr: 2, bgcolor: 'white', color: 'primary.main' }}
              >
                {child.name[0]}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h4" component="h1">
                  {child.name}의 포인트
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <StarsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {child.availablePoints} 포인트 사용가능 (총 {child.totalPoints})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 포인트 통계 */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2} sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" color="success.main">
                받은 포인트
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              {earnedPoints}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="error.main">
                사용한 포인트
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main">
              {spentPoints}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <StarsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary.main">
                사용 가능한 포인트
              </Typography>
            </Box>
            <Typography variant="h4" color="primary.main">
              {child.availablePoints}
            </Typography>
          </Paper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 액션 버튼들 */}
        <Box display="flex" gap={2} sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(!showHistory)}
          >
            포인트 내역
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={() => setShowPurchases(!showPurchases)}
          >
            구매 내역
          </Button>
        </Box>

        {/* 포인트 내역 */}
        {showHistory && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                포인트 내역
              </Typography>
              {pointHistory.length === 0 ? (
                <Typography color="textSecondary">
                  포인트 내역이 없습니다.
                </Typography>
              ) : (
                <List>
                  {pointHistory.slice(0, 10).map((transaction) => (
                    <ListItem key={transaction.id}>
                      <ListItemIcon>
                        <StarsIcon color={transaction.transactionType === 'EARN' ? 'success' : 'error'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.reason || '포인트 변경'}
                        secondary={
                          <Box>
                            {transaction.message && (
                              <Typography variant="body2" color="textSecondary">
                                {transaction.message}
                              </Typography>
                            )}
                            <Typography variant="caption" color="textSecondary">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={`${transaction.transactionType === 'EARN' ? '+' : '-'}${transaction.points}`}
                        color={transaction.transactionType === 'EARN' ? 'success' : 'error'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* 구매 내역 */}
        {showPurchases && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                구매 내역
              </Typography>
              {purchases.length === 0 ? (
                <Typography color="textSecondary">
                  구매 내역이 없습니다.
                </Typography>
              ) : (
                <List>
                  {purchases.slice(0, 10).map((purchase) => (
                    <ListItem 
                      key={purchase.id}
                      secondaryAction={
                        purchase.status === 'PENDING' && (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={cancelingPurchase === purchase.id}
                            onClick={() => handleCancelPurchase(purchase.id)}
                          >
                            {cancelingPurchase === purchase.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              '취소'
                            )}
                          </Button>
                        )
                      }
                    >
                      <ListItemText
                        primary={purchase.rewardName}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary">
                              {purchase.requiredPoints} 포인트
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(purchase.requestedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ mr: purchase.status === 'PENDING' ? 8 : 0 }}>
                        <Chip
                          label={getStatusLabel(purchase.status)}
                          color={getStatusColor(purchase.status) as any}
                          size="small"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* 상품 목록 */}
        <Box display="flex" alignItems="center" mb={2}>
          <StoreIcon sx={{ mr: 1 }} />
          <Typography variant="h5">
            구매 가능한 상품
          </Typography>
        </Box>
        
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={3}>
          {rewards.map((reward) => (
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: canAfford(reward) ? 1 : 0.6,
                  cursor: canAfford(reward) ? 'pointer' : 'default',
                  '&:hover': canAfford(reward) ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  } : {}
                }}
                onClick={() => canAfford(reward) && handleRewardClick(reward)}
              >
                {reward.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={reward.imageUrl}
                    alt={reward.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {reward.name}
                  </Typography>
                  {reward.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {reward.description}
                    </Typography>
                  )}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={`${reward.requiredPoints} 포인트`}
                      color={canAfford(reward) ? 'success' : 'default'}
                      variant={canAfford(reward) ? 'filled' : 'outlined'}
                    />
                    {canAfford(reward) && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRewardClick(reward);
                        }}
                      >
                        구매하기
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
          ))}
        </Box>

        {rewards.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              구매 가능한 상품이 없습니다.
            </Typography>
          </Box>
        )}
      </Container>

      {/* 구매 확인 다이얼로그 */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>구매 확인</DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box>
              <Typography gutterBottom>
                "{selectedReward.name}"을(를) 구매하시겠습니까?
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                필요 포인트: {selectedReward.requiredPoints}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                사용 가능한 포인트: {child.availablePoints}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold">
                구매 후 남은 포인트: {child.availablePoints - selectedReward.requiredPoints}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={purchasing}>
            취소
          </Button>
          <Button onClick={handlePurchaseConfirm} disabled={purchasing} color="primary" variant="contained">
            {purchasing ? <CircularProgress size={24} /> : '구매 요청'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildDashboardNew;