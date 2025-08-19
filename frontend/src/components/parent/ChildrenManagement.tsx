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
  IconButton,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Child, ChildRequest } from '../../types';
import { childAPI } from '../../services/api';

const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState<ChildRequest>({
    name: '',
    birthDate: null,
    profileImage: null,
    username: null,
    authKey: null
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await childAPI.getChildren();
      setChildren(data);
    } catch (error) {
      setError('아이 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (child?: Child) => {
    if (child) {
      setEditingChild(child);
      setFormData({
        name: child.name,
        birthDate: child.birthDate,
        profileImage: child.profileImage,
        username: child.username,
        authKey: child.authKey
      });
    } else {
      setEditingChild(null);
      setFormData({
        name: '',
        birthDate: null,
        profileImage: null,
        username: null,
        authKey: null
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingChild(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value || null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingChild) {
        await childAPI.updateChild(editingChild.id, formData);
      } else {
        await childAPI.createChild(formData);
      }
      await fetchChildren();
      handleCloseDialog();
    } catch (error) {
      setError(editingChild ? '아이 정보 수정에 실패했습니다.' : '아이 추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 아이를 삭제하시겠습니까?')) {
      try {
        await childAPI.deleteChild(id);
        await fetchChildren();
      } catch (error) {
        setError('아이 삭제에 실패했습니다.');
      }
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
        <Typography variant="h4">아이 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          아이 추가
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
        {children.map((child) => (
          <Card key={child.id}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2 }}>
                    {child.profileImage ? (
                      <img src={child.profileImage} alt={child.name} />
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h6">{child.name}</Typography>
                    {child.birthDate && (
                      <Typography color="textSecondary" variant="body2">
                        생년월일: {child.birthDate}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Chip
                      label={`${child.totalPoints} 포인트`}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    {child.username && (
                      <Chip
                        label={`ID: ${child.username}`}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(child)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(child.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      {children.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            등록된 아이가 없습니다.
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            '아이 추가' 버튼을 눌러 첫 번째 아이를 등록해보세요.
          </Typography>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingChild ? '아이 정보 수정' : '새 아이 추가'}
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
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              fullWidth
              id="birthDate"
              label="생년월일"
              name="birthDate"
              type="date"
              value={formData.birthDate || ''}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              fullWidth
              id="profileImage"
              label="프로필 이미지 URL"
              name="profileImage"
              value={formData.profileImage || ''}
              onChange={handleChange}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="아이 로그인 아이디"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              disabled={submitting}
              helperText="아이가 로그인할 때 사용할 아이디입니다."
            />
            <TextField
              margin="normal"
              fullWidth
              id="authKey"
              label="아이 로그인 비밀번호"
              name="authKey"
              type="password"
              value={formData.authKey || ''}
              onChange={handleChange}
              disabled={submitting}
              helperText="아이가 로그인할 때 사용할 비밀번호입니다."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : (editingChild ? '수정' : '추가')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildrenManagement;