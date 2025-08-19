import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Fab
} from '@mui/material';
import {
  Stars as StarsIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Child, Reward, PointTransaction, Purchase, PurchaseRequest } from '../../types';
import { childAPI, rewardAPI, pointAPI, purchaseAPI } from '../../services/api';

const ChildDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  useEffect(() => {
    if (childId) {
      fetchData();
    }
  }, [childId]);

  const fetchData = async () => {
    if (!childId) return;

    try {
      const [childData, rewardsData, historyData, purchasesData] = await Promise.all([
        childAPI.getChild(parseInt(childId)),
        rewardAPI.getActiveRewards(),
        pointAPI.getPointHistory(parseInt(childId)),
        purchaseAPI.getPurchasesByChild(parseInt(childId))
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

  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setConfirmDialog(true);
  };

  const handlePurchaseConfirm = async () => {
    if (!selectedReward || !child) return;

    setPurchasing(true);
    setError('');

    try {
      const request: PurchaseRequest = {
        childId: child.id,
        rewardId: selectedReward.id
      };
      await purchaseAPI.requestPurchase(request);
      await fetchData();
      setConfirmDialog(false);
      setSelectedReward(null);
    } catch (error) {
      setError('구매 요청에 실패했습니다.');
    } finally {
      setPurchasing(false);
    }
  };

  const canAfford = (reward: Reward) => {
    return child ? child.totalPoints >= reward.requiredPoints : false;
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
      <Fab
        color="primary"
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}
        onClick={() => navigate('/parent')}
      >
        <ArrowBackIcon />
      </Fab>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* 헤더 */}
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
                    {child.totalPoints} 포인트 보유
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

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
                  {pointHistory.slice(0, 5).map((transaction) => (
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
                  {purchases.slice(0, 5).map((purchase) => (
                    <ListItem key={purchase.id}>
                      <ListItemText
                        primary={purchase.reward.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary">
                              {purchase.reward.requiredPoints} 포인트
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(purchase.requestedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={getStatusLabel(purchase.status)}
                        color={getStatusColor(purchase.status) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}

        {/* 상품 목록 */}
        <Typography variant="h5" gutterBottom>
          구매 가능한 상품
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
          {rewards.map((reward) => (
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: canAfford(reward) ? 1 : 0.6,
                  cursor: canAfford(reward) ? 'pointer' : 'default'
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
              <Typography variant="body2" color="textSecondary" gutterBottom>
                필요 포인트: {selectedReward.requiredPoints}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                현재 보유 포인트: {child.totalPoints}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                구매 후 남은 포인트: {child.totalPoints - selectedReward.requiredPoints}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={purchasing}>
            취소
          </Button>
          <Button onClick={handlePurchaseConfirm} disabled={purchasing} color="primary">
            {purchasing ? <CircularProgress size={24} /> : '구매 요청'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildDashboard;