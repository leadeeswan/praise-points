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
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { Reward, RewardRequest } from '../../types';
import { rewardAPI } from '../../services/api';

const RewardsManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState<RewardRequest>({
    name: '',
    description: '',
    requiredPoints: 1,
    category: 'OTHER',
    imageUrl: '',
    active: true
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'TOY', label: '장난감' },
    { value: 'SNACK', label: '간식' },
    { value: 'EXPERIENCE', label: '체험활동' },
    { value: 'MONEY', label: '용돈' },
    { value: 'OTHER', label: '기타' }
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await rewardAPI.getRewards();
      setRewards(data);
    } catch (error) {
      setError('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        name: reward.name,
        description: reward.description || '',
        requiredPoints: reward.requiredPoints,
        category: reward.category,
        imageUrl: reward.imageUrl || '',
        active: reward.active
      });
    } else {
      setEditingReward(null);
      setFormData({
        name: '',
        description: '',
        requiredPoints: 1,
        category: 'OTHER',
        imageUrl: '',
        active: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingReward(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 1 : value || null
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      active: e.target.checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingReward) {
        await rewardAPI.updateReward(editingReward.id, formData);
      } else {
        await rewardAPI.createReward(formData);
      }
      await fetchRewards();
      handleCloseDialog();
    } catch (error) {
      setError(editingReward ? '상품 수정에 실패했습니다.' : '상품 추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await rewardAPI.deleteReward(id);
        await fetchRewards();
      } catch (error) {
        setError('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await rewardAPI.toggleRewardStatus(id);
      await fetchRewards();
    } catch (error) {
      setError('상품 상태 변경에 실패했습니다.');
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
        <Typography variant="h4">상품 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          상품 추가
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
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {rewards.map((reward) => (
          <Card key={reward.id}>
              {reward.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={reward.imageUrl}
                  alt={reward.name}
                />
              )}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Typography variant="h6" component="div">
                    {reward.name}
                  </Typography>
                  <Chip
                    label={reward.active ? '활성' : '비활성'}
                    color={reward.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                {reward.description && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {reward.description}
                  </Typography>
                )}
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    label={categories.find(c => c.value === reward.category)?.label || reward.category}
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="h6" color="primary">
                    {reward.requiredPoints} 포인트
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStatus(reward.id)}
                    color={reward.active ? 'success' : 'default'}
                  >
                    {reward.active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(reward)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(reward.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      {rewards.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            등록된 상품이 없습니다.
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            '상품 추가' 버튼을 눌러 첫 번째 상품을 등록해보세요.
          </Typography>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReward ? '상품 수정' : '새 상품 추가'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="상품명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="상품 설명"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="requiredPoints"
              label="필요 포인트"
              name="requiredPoints"
              type="number"
              value={formData.requiredPoints}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              disabled={submitting}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>카테고리</InputLabel>
              <Select
                value={formData.category}
                label="카테고리"
                name="category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                disabled={submitting}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="imageUrl"
              label="상품 이미지 URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={submitting}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleSwitchChange}
                  disabled={submitting}
                />
              }
              label="상품 활성화"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : (editingReward ? '수정' : '추가')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RewardsManagement;