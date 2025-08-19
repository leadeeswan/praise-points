import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Stars as StarsIcon
} from '@mui/icons-material';
import { Child, PointAwardRequest, PointTransaction } from '../../types';
import { childAPI, pointAPI } from '../../services/api';

const PointsManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PointAwardRequest>({
    childIds: [],
    points: 1,
    reason: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const predefinedReasons = [
    '숙제 완료',
    '정리정돈',
    '도움 행동',
    '예의바른 행동',
    '동생 돌보기',
    '기타'
  ];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await childAPI.getChildren();
      setChildren(data);
      if (data.length > 0) {
        setSelectedChild(data[0]);
        fetchPointHistory(data[0].id);
      }
    } catch (error) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPointHistory = async (childId: number) => {
    try {
      const data = await pointAPI.getPointHistory(childId);
      setPointHistory(data);
    } catch (error) {
      console.error('Failed to fetch point history:', error);
    }
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    fetchPointHistory(child.id);
  };

  const handleOpenDialog = () => {
    setFormData({
      childIds: [],
      points: 1,
      reason: '',
      message: ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'points' ? parseInt(value) || 1 : value
    });
  };

  const handleChildSelection = (childId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      childIds: checked 
        ? [...prev.childIds, childId]
        : prev.childIds.filter(id => id !== childId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.childIds.length === 0) {
      setError('최소 한 명의 아이를 선택해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await pointAPI.awardPoints(formData);
      await fetchChildren();
      if (selectedChild) {
        await fetchPointHistory(selectedChild.id);
      }
      handleCloseDialog();
    } catch (error) {
      setError('포인트 지급에 실패했습니다.');
    } finally {
      setSubmitting(false);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">포인트 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={children.length === 0}
        >
          포인트 지급
        </Button>
      </Box>

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
            md: '1fr 2fr'
          },
          gap: 3
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              아이 목록
            </Typography>
            {children.length === 0 ? (
              <Typography color="textSecondary">
                등록된 아이가 없습니다.
              </Typography>
            ) : (
              <List>
                {children.map((child) => (
                  <ListItem key={child.id}>
                    <Box
                      sx={{
                        width: '100%',
                        cursor: 'pointer',
                        p: 1,
                        bgcolor: selectedChild?.id === child.id ? 'action.selected' : 'transparent',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => handleChildSelect(child)}
                    >
                      <ListItemText
                        primary={child.name}
                        secondary={
                          <Box display="flex" alignItems="center" mt={1}>
                            <StarsIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {child.totalPoints} 포인트
                            </Typography>
                          </Box>
                        }
                      />
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
              {selectedChild ? `${selectedChild.name}의 포인트 내역` : '포인트 내역'}
            </Typography>
            {!selectedChild ? (
              <Typography color="textSecondary">
                아이를 선택해주세요.
              </Typography>
            ) : pointHistory.length === 0 ? (
              <Typography color="textSecondary">
                포인트 내역이 없습니다.
              </Typography>
            ) : (
              <List>
                {pointHistory.map((transaction) => (
                  <ListItem key={transaction.id}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography>
                            {transaction.reason || '포인트 지급/차감'}
                          </Typography>
                          <Chip
                            label={`${transaction.transactionType === 'EARN' ? '+' : '-'}${transaction.points}`}
                            color={transaction.transactionType === 'EARN' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      }
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
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>포인트 지급</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              아이 선택 (다중 선택 가능)
            </Typography>
            <Box sx={{ mb: 2 }}>
              {children.map((child) => (
                <FormControlLabel
                  key={child.id}
                  control={
                    <Checkbox
                      checked={formData.childIds.includes(child.id)}
                      onChange={(e) => handleChildSelection(child.id, e.target.checked)}
                    />
                  }
                  label={`${child.name} (${child.totalPoints}P)`}
                />
              ))}
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="points"
              label="포인트 수"
              name="points"
              type="number"
              value={formData.points}
              onChange={handleChange}
              inputProps={{ min: 1, max: 10 }}
              disabled={submitting}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>칭찬 사유</InputLabel>
              <Select
                value={formData.reason}
                label="칭찬 사유"
                name="reason"
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                disabled={submitting}
              >
                {predefinedReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="message"
              label="칭찬 메시지 (선택사항)"
              name="message"
              multiline
              rows={3}
              value={formData.message}
              onChange={handleChange}
              disabled={submitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : '지급'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PointsManagement;