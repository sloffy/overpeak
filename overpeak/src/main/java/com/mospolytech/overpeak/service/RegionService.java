package com.mospolytech.overpeak.service;

import com.mospolytech.overpeak.domain.Region;

public interface RegionService {

    Region findByName(String name);

}
