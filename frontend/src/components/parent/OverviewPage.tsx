import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Stars as StarsIcon,
  ShoppingCart as ShoppingCartIcon,
  Redeem as RedeemIcon
} from '@mui/icons-material';
import { Child, Purchase } from '../../types';
import { childAPI, purchaseAPI } from '../../services/api';

const OverviewPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenData, purchasesData] = await Promise.all([
          childAPI.getChildren(),
          purchaseAPI.getPendingPurchases()
        ]);
        setChildren(childrenData);
        setPendingPurchases(purchasesData);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const totalPoints = children.reduce((sum, child) => sum + child.totalPoints, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PersonIcon color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  등록된 아이
                </Typography>
                <Typography variant="h4">
                  {children.length}명
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <StarsIcon color="secondary" sx={{ mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  총 보유 포인트
                </Typography>
                <Typography variant="h4">
                  {totalPoints}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ShoppingCartIcon color="warning" sx={{ mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  승인 대기
                </Typography>
                <Typography variant="h4">
                  {pendingPurchases.length}건
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <RedeemIcon color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  평균 포인트
                </Typography>
                <Typography variant="h4">
                  {children.length > 0 ? Math.round(totalPoints / children.length) : 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 3,
          mt: 2
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              아이별 포인트 현황
            </Typography>
            {children.length === 0 ? (
              <Typography color="textSecondary">
                등록된 아이가 없습니다.
              </Typography>
            ) : (
              <List>
                {children.map((child) => (
                  <ListItem key={child.id}>
                    <ListItemText
                      primary={child.name}
                      secondary={`${child.totalPoints} 포인트`}
                    />
                    <Chip 
                      label={`${child.totalPoints}P`}
                      color="primary"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              승인 대기 중인 구매
            </Typography>
            {pendingPurchases.length === 0 ? (
              <Typography color="textSecondary">
                승인 대기 중인 구매가 없습니다.
              </Typography>
            ) : (
              <List>
                {pendingPurchases.slice(0, 5).map((purchase) => (
                  <ListItem key={purchase.id}>
                    <ListItemText
                      primary={`${purchase.child.name} - ${purchase.reward.name}`}
                      secondary={`${purchase.reward.requiredPoints} 포인트`}
                    />
                    <Chip 
                      label="대기"
                      color="warning"
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default OverviewPage;