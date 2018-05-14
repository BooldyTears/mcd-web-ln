package com.asiainfo.biapp.mcd.provinces.ln.service;

import com.asiainfo.biapp.mcd.interfaces.smsmessage.service.ISmsMessageService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("smsMessageService")
public class SmsMessageServiceLNImpl implements ISmsMessageService {
    @Override
    public void sendSMSBatch(List<Map<String, Object>> msgList) throws Exception {

    }
}
