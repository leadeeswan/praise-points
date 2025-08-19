import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Purchase } from '../../types';
import { purchaseAPI } from '../../services/api';

const PurchaseApproval: React.FC = () => {
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    purchase: Purchase | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    purchase: null,
    action: null
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const [pendingData, allData] = await Promise.all([
        purchaseAPI.getPendingPurchases(),
        purchaseAPI.getAllPurchases()
      ]);
      setPendingPurchases(pendingData);
      setAllPurchases(allData);
    } catch (error) {
      setError('구매 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmDialog = (purchase: Purchase, action: 'approve' | 'reject') => {
    setConfirmDialog({
      open: true,
      purchase,
      action
    });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      purchase: null,
      action: null
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.purchase || !confirmDialog.action) return;

    setProcessing(true);
    setError('');

    try {
      if (confirmDialog.action === 'approve') {
        await purchaseAPI.approvePurchase(confirmDialog.purchase.id);
      } else {
        await purchaseAPI.rejectPurchase(confirmDialog.purchase.id);
      }
      await fetchPurchases();
      handleCloseConfirmDialog();
    } catch (error) {
      setError(`구매 ${confirmDialog.action === 'approve' ? '승인' : '거절'}에 실패했습니다.`);
    } finally {
      setProcessing(false);
    }
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
        return '승인';
      case 'REJECTED':
        return '거절';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        구매 승인 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'repeat(2, 1fr)'
          },
          gap: 3
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <ShoppingCartIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">
                승인 대기 ({pendingPurchases.length})
              </Typography>
            </Box>
            
            {pendingPurchases.length === 0 ? (
              <Typography color="textSecondary">
                승인 대기 중인 구매가 없습니다.
              </Typography>
            ) : (
              <List>
                {pendingPurchases.map((purchase) => (
                  <ListItem key={purchase.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle1">
                            {purchase.child.name} → {purchase.reward.name}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {purchase.reward.requiredPoints} 포인트
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {new Date(purchase.requestedAt).toLocaleString()}
                        </Typography>
                      }
                    />
                    <Box>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenConfirmDialog(purchase, 'approve')}
                        sx={{ mr: 1 }}
                      >
                        승인
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenConfirmDialog(purchase, 'reject')}
                      >
                        거절
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              전체 구매 내역
            </Typography>
            
            {allPurchases.length === 0 ? (
              <Typography color="textSecondary">
                구매 내역이 없습니다.
              </Typography>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {allPurchases.slice(0, 10).map((purchase) => (
                  <ListItem key={purchase.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {purchase.child.name} → {purchase.reward.name}
                          </Typography>
                          <Chip
                            label={getStatusLabel(purchase.status)}
                            color={getStatusColor(purchase.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="primary">
                            {purchase.reward.requiredPoints} 포인트
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            요청: {new Date(purchase.requestedAt).toLocaleString()}
                            {purchase.approvedAt && (
                              <span> | 처리: {new Date(purchase.approvedAt).toLocaleString()}</span>
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog}>
        <DialogTitle>
          구매 {confirmDialog.action === 'approve' ? '승인' : '거절'}
        </DialogTitle>
        <DialogContent>
          {confirmDialog.purchase && (
            <Typography>
              {confirmDialog.purchase.child.name}이(가) 요청한 "{confirmDialog.purchase.reward.name}"을(를) 
              {confirmDialog.action === 'approve' ? ' 승인' : ' 거절'}하시겠습니까?
              <br />
              <br />
              필요 포인트: {confirmDialog.purchase.reward.requiredPoints}
              <br />
              현재 보유 포인트: {confirmDialog.purchase.child.totalPoints}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} disabled={processing}>
            취소
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={confirmDialog.action === 'approve' ? 'success' : 'error'}
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 
             (confirmDialog.action === 'approve' ? '승인' : '거절')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseApproval;